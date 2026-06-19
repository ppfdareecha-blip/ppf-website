import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Publication from "@/lib/models/Publication";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  try {
    await dbConnect();
    const publications = await Publication.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: publications });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  try {
    await dbConnect();
    const body = await req.json();

    const {
      title,
      publicationType,
      author,
      date,
      tags,
      description,
      source,
      status,
      version,
      year,
      type,
      category,
      link,
      imgUrl,   // pre-uploaded Cloudinary URL from browser
      fileUrl,  // pre-uploaded Cloudinary URL from browser
    } = body;

    if (!title || !publicationType) {
      return NextResponse.json(
        { success: false, error: "Title and Publication Type are required fields." },
        { status: 400 }
      );
    }

    let tagsArray = [];
    if (tags) {
      if (Array.isArray(tags)) {
        tagsArray = tags;
      } else if (typeof tags === "string") {
        tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    const newPublication = await Publication.create({
      title,
      publicationType,
      author: author || "",
      date: date || "",
      tags: tagsArray,
      img: imgUrl || "",
      file: fileUrl || "",
      description: description || "",
      source: source || "",
      status: status || "Ongoing",
      version: version || "",
      year: year || "",
      type: type || "PDF",
      category: category || "Audit",
      link: link || "",
    });

    return NextResponse.json({ success: true, data: newPublication }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
