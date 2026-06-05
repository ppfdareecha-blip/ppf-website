import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import Opinion from "@/lib/models/Opinion";

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    // Find the author by authorId
    const author = await Author.findOne({ authorId: slug })
      .populate({
        path: "opinionsWritten",
        options: { sort: { createdAt: -1 } }
      })
      .lean();

    if (!author) {
      return NextResponse.json({ success: false, message: "Author not found" }, { status: 404 });
    }

    // Format written opinions for consistency in layout rendering
    const formattedOpinions = (author.opinionsWritten || []).map((op) => {
      const dateStr = op.createdAt
        ? new Date(op.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Recent";

      return {
        _id: op._id.toString(),
        id: op.opinionId,
        title: op.title,
        description: op.description || "",
        category: op.tag || "Opinion",
        centerTag: op.center || "",
        date: dateStr,
        image: op.attachedPoster || "/pictures/opinionMockup.jpg",
        downloadableLink: op.downloadableLink || "",
      };
    });

    // Structure returned object
    const authorData = {
      id: author._id.toString(),
      authorId: author.authorId,
      name: author.authorName,
      position: author.authorPosition,
      image: author.authorImage || "",
      about: author.about || "",
      socialLinks: author.socialLinks || [],
      opinions: formattedOpinions
    };

    return NextResponse.json({ success: true, data: authorData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
