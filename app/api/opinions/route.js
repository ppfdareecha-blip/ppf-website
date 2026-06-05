import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";
import UnApprovedOpinion from "@/lib/models/UnApprovedOpinion";
import Author from "@/lib/models/Author";
import { v2 as cloudinary } from "cloudinary";


export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await dbConnect();
    // Fetch approved opinions and populate author information
    const opinions = await Opinion.find({})
      .populate("authors")
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const formattedOpinions = opinions.map((op) => {
      // Resolve authors array
      const resolvedAuthors = op.authors || [];

      const authorNames = resolvedAuthors.map(a => a.authorName).filter(Boolean).join(" & ") || "PPF Expert";
      const authorPositions = resolvedAuthors.map(a => a.authorPosition).filter(Boolean).join(" & ") || "";
      const primaryAuthor = resolvedAuthors[0] || {};
      const primaryAuthorImage = primaryAuthor.authorImage || primaryAuthor.authorPictureLink || primaryAuthor.authorImageLink || primaryAuthor.profilePictureUrl || "";

      // Static formatted date fallback
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
        category: op.tag || "Opinion",
        centerTag: op.center || "",
        date: dateStr,
        title: op.title,
        content: op.description,
        author: authorNames,
        authorPosition: authorPositions,
        authorImage: primaryAuthorImage,
        authors: resolvedAuthors.map(a => ({
          id: a.authorId || "",
          name: a.authorName || "PPF Expert",
          position: a.authorPosition || "",
          image: a.authorImage || a.authorPictureLink || a.authorImageLink || a.profilePictureUrl || "",
        })),
        image: op.attachedPoster || "/pictures/opinionMockup.jpg",
        downloadableLink: op.downloadableLink || "",
        createdAt: op.createdAt || new Date(0),
      };
    });

    return NextResponse.json({ success: true, data: formattedOpinions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { title, author, email, content, imageBase64 } = await req.json();

    let imageUrl = "";
    if (imageBase64) {
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-opinions",
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Submit to UnApprovedOpinion collection
    const pendingOpinion = await UnApprovedOpinion.create({
      title,
      description: content,
      authorName: author,
      authorEmail: email,
      tag: "Opinion",
      center: "",
      attachedPoster: imageUrl,
      downloadableLink: "",
    });

    return NextResponse.json({ success: true, data: pendingOpinion }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
