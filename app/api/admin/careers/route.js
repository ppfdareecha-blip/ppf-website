import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Career from "@/lib/models/Career";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await dbConnect();
    const careers = await Career.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: careers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      type,
      title,
      category,
      description,
      location,
      duration,
      stipend,
      price,
      startDate,
      requirements,
      responsibilities,
      applyLink,
      imageBase64,
      status,
    } = body;

    if (!type || !title) {
      return NextResponse.json({ success: false, message: "Type and Title are required." }, { status: 400 });
    }

    let imageUrl = "";
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-careers",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newCareer = await Career.create({
      type,
      title,
      category: category || "",
      description: description || "",
      location: location || "",
      duration: duration || "",
      stipend: stipend || "",
      price: price || "",
      startDate: startDate || "",
      requirements: requirements || "",
      responsibilities: responsibilities || "",
      applyLink: applyLink || "",
      image: imageUrl || "",
      status: status || "active",
    });

    return NextResponse.json({ success: true, data: newCareer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
