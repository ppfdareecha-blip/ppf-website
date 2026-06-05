import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";

/**
 * GET /api/admin/opinions-manage/images
 * Returns all unique cover image URLs previously used in Opinion documents.
 */
export async function GET() {
  try {
    await dbConnect();
    const opinions = await Opinion.find(
      { attachedPoster: { $exists: true, $ne: "" } },
      { attachedPoster: 1, title: 1, _id: 1 }
    ).sort({ createdAt: -1 });

    // Deduplicate by URL while preserving order
    const seen = new Set();
    const images = [];
    for (const op of opinions) {
      if (op.attachedPoster && !seen.has(op.attachedPoster)) {
        seen.add(op.attachedPoster);
        images.push({ url: op.attachedPoster, title: op.title });
      }
    }

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
