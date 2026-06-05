import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Media from "@/lib/models/Media";

const SLOT_LIMIT = 3;

const normalizeSlots = (value, legacyValue = "") => {
  const rawValues = Array.isArray(value) && value.length ? value : [legacyValue || value];

  return rawValues
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, SLOT_LIMIT);
};

const sanitizeMediaLinks = (body) => ({
  youtubeVideoIds: normalizeSlots(body.youtubeVideoIds, body.youtubeVideoId),
  instagramPostUrls: normalizeSlots(body.instagramPostUrls, body.instagramPostUrl),
  linkedinUrns: normalizeSlots(body.linkedinUrns, body.linkedinUrn),
  xPostUrls: normalizeSlots(body.xPostUrls, body.xPostUrl),
});

const serializeMedia = (media) => {
  const youtubeVideoIds = normalizeSlots(media.youtubeVideoIds, media.youtubeVideoId);
  const instagramPostUrls = normalizeSlots(media.instagramPostUrls, media.instagramPostUrl);
  const linkedinUrns = normalizeSlots(media.linkedinUrns, media.linkedinUrn);
  const xPostUrls = normalizeSlots(media.xPostUrls, media.xPostUrl);
  const mediaObject = media.toObject?.() || media;

  return {
    ...mediaObject,
    youtubeVideoId: youtubeVideoIds[0] || "",
    instagramPostUrl: instagramPostUrls[0] || "",
    linkedinUrn: linkedinUrns[0] || "",
    xPostUrl: xPostUrls[0] || "",
    youtubeVideoIds,
    instagramPostUrls,
    linkedinUrns,
    xPostUrls,
  };
};

export async function GET() {
  try {
    await dbConnect();
    const media = await Media.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: media.map(serializeMedia) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const sanitized = sanitizeMediaLinks(body);
    const newMedia = await Media.create({
      ...sanitized,
      youtubeVideoId: sanitized.youtubeVideoIds[0] || "",
      instagramPostUrl: sanitized.instagramPostUrls[0] || "",
      linkedinUrn: sanitized.linkedinUrns[0] || "",
      xPostUrl: sanitized.xPostUrls[0] || "",
    });

    return NextResponse.json({ success: true, data: serializeMedia(newMedia) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const sanitized = sanitizeMediaLinks(body);
    const updateData = {
      ...sanitized,
      youtubeVideoId: sanitized.youtubeVideoIds[0] || "",
      instagramPostUrl: sanitized.instagramPostUrls[0] || "",
      linkedinUrn: sanitized.linkedinUrns[0] || "",
      xPostUrl: sanitized.xPostUrls[0] || "",
    };

    const media = await Media.findOneAndUpdate(
      {},
      updateData,
      {
        new: true,
        upsert: true,
        sort: { createdAt: -1 },
        runValidators: true,
      }
    );

    return NextResponse.json({ success: true, data: serializeMedia(media) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
