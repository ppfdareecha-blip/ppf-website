import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Media from "@/lib/models/Media";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PUT - Update media
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { title, description, link, source, date, imageBase64 } = await req.json();

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid media ID" },
        { status: 400 }
      );
    }

    const updateData = {
      title,
      description: description || "",
      link,
      source: source || "",
      date: date || new Date().toISOString().split("T")[0],
    };

    // If new image provided, upload to Cloudinary
    if (imageBase64 && imageBase64.startsWith("data:")) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-media",
      });
      updateData.thumbnail = uploadResponse.secure_url;
    }

    const updatedMedia = await Media.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMedia) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedMedia });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove media
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid media ID" },
        { status: 400 }
      );
    }

    const media = await Media.findByIdAndDelete(id);

    if (!media) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    // Optional: Delete image from Cloudinary if it exists
    if (media.thumbnail) {
      try {
        const publicId = media.thumbnail.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`ppf-media/${publicId}`);
      } catch (err) {
        console.error("Error deleting from Cloudinary:", err);
        // Don't fail the entire operation if Cloudinary delete fails
      }
    }

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
