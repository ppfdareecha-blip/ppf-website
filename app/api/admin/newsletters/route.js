import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/lib/models/Newsletter";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await dbConnect();
    const newsletters = await Newsletter.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: newsletters });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { title, description, pdfLink, date, imageBase64 } = await req.json();

    let thumbnailUrl = "";
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-newsletters",
      });
      thumbnailUrl = uploadResponse.secure_url;
    }

    const newNewsletter = await Newsletter.create({
      title,
      description: description || "",
      pdfLink,
      date: date || new Date().toISOString().split("T")[0],
      thumbnail: thumbnailUrl || "",
    });

    return NextResponse.json({ success: true, data: newNewsletter }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
