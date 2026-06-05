import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import Opinion from "@/lib/models/Opinion";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    // Fetch all authors and populate their written opinions to show titles or counts
    const authors = await Author.find({})
      .populate("opinionsWritten")
      .sort({ createdAt: 1 });

    return NextResponse.json({ success: true, data: authors });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { 
      authorName, 
      authorPosition, 
      authorIdLink,
      authorImage,
      about,
      socialLinks 
    } = await req.json();

    if (!authorName || !authorPosition) {
      return NextResponse.json(
        { success: false, error: "authorName and authorPosition are required fields" },
        { status: 400 }
      );
    }

    // Generate unique authorId slug
    const generateShortId = () => Math.random().toString(36).substring(2, 6);
    const slugify = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const authorId = `author-${slugify(authorName)}-${generateShortId()}`;

    let finalImageLink = authorImage || "";
    const finalBio = about || "";

    // Upload base64 image to Cloudinary if it's a new upload
    if (finalImageLink && finalImageLink.startsWith("data:image/")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(finalImageLink, {
          folder: "ppf-opinions-admin/authors",
        });
        finalImageLink = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed for new author:", err);
        return NextResponse.json({ success: false, error: "Failed to upload profile picture to Cloudinary: " + err.message }, { status: 500 });
      }
    }

    const newAuthor = await Author.create({
      authorId,
      authorName,
      authorPosition,
      authorImage: finalImageLink, // Set authorImage
      authorIdLink: authorIdLink || `/pages/authors/${authorId}`,
      about: finalBio, // Set about biography
      socialLinks: socialLinks || [],
      opinionsWritten: [],
    });

    return NextResponse.json({ success: true, data: newAuthor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
