import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Dialogue from "@/lib/models/Dialogue";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  try {
    await dbConnect();
    const dialogues = await Dialogue.find({}).sort({ sortDate: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: dialogues });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  try {
    await dbConnect();
    const {
      title,
      description,
      date,
      sortDate,
      imageBase64,
      pdfLink,
      reportPdfBase64,
    } = await req.json();

    let imageUrl = "";
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-dialogues",
      });
      imageUrl = uploadResponse.secure_url;
    }

    let reportPdfUrl = "";
    if (reportPdfBase64) {
      const uploadResponse = await cloudinary.uploader.upload(reportPdfBase64, {
        folder: "ppf-dialogue-reports",
        resource_type: "auto",
      });
      reportPdfUrl = uploadResponse.secure_url;
    }

    const newDialogueData = {
      title: title || "New Dialogue",
      description: description || "",
      date: date || new Date().toISOString().split("T")[0],
      sortDate: sortDate ? new Date(sortDate) : new Date(),
      image: imageUrl || "",
      pdfLink: pdfLink || "",
      reportPdf: reportPdfUrl || "",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Use collection.insertOne to bypass Mongoose strict mode caching issues during hot-reload
    const newDialogueResult = await Dialogue.collection.insertOne(newDialogueData);
    const newDialogue = { ...newDialogueData, _id: newDialogueResult.insertedId };

    return NextResponse.json({ success: true, data: newDialogue }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
