import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Media from "@/lib/models/Media";

export const dynamic = 'force-dynamic';

const SLOT_LIMIT = 3;

const normalizeSlots = (value, legacyValue = "") => {
  const rawValues = Array.isArray(value) && value.length ? value : [legacyValue || value];

  return rawValues
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, SLOT_LIMIT);
};

const serializeMedia = (media) => {
  const youtubeVideoIds = normalizeSlots(media.youtubeVideoIds, media.youtubeVideoId);
  const instagramPostUrls = normalizeSlots(media.instagramPostUrls, media.instagramPostUrl);
  const linkedinUrns = normalizeSlots(media.linkedinUrns, media.linkedinUrn);
  const xPostUrls = normalizeSlots(media.xPostUrls, media.xPostUrl);

  return {
    id: media._id.toString(),
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

const emptyMedia = {
  youtubeVideoId: "",
  instagramPostUrl: "",
  linkedinUrn: "",
  xPostUrl: "",
  youtubeVideoIds: [],
  instagramPostUrls: [],
  linkedinUrns: [],
  xPostUrls: [],
};

export async function GET() {
  try {
    await dbConnect();
    const media = await Media.findOne({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: media ? serializeMedia(media) : emptyMedia,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
