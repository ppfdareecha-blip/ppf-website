import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
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
        { success: false, error: "authorName and authorPosition are required" },
        { status: 400 }
      );
    }

    let finalImageLink = authorImage || "";
    const finalBio = about || "";

    // Upload base64 image to Cloudinary if it's a new upload
    if (finalImageLink && finalImageLink.startsWith("data:image/")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(finalImageLink, {
          folder: "ppf-opinions-admin/authors",
          overwrite: true,
        });
        finalImageLink = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed for author:", err);
        return NextResponse.json({ success: false, error: "Failed to upload profile picture to Cloudinary: " + err.message }, { status: 500 });
      }
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      {
        authorName,
        authorPosition,
        authorImage: finalImageLink, // Stores profile picture URL
        authorIdLink: authorIdLink || undefined, // Only update if passed
        about: finalBio, // Stores biography
        socialLinks: socialLinks || [],
      },
      { new: true }
    );

    if (!updatedAuthor) {
      return NextResponse.json({ success: false, error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAuthor });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedAuthor = await Author.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    if (!deletedAuthor) {
      return NextResponse.json({ success: false, error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
