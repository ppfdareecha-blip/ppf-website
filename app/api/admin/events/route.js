export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/adminAuth";

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
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: events });
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
      venue,
      date,
      fromTime,
      toTime,
      about,
      speaker,
      centerTag,
      imageBase64,
      mode: modeInput,
      speakers: speakersInput,
      pdfLink,
      reportPdfBase64,
    } = await req.json();

    let imageUrl = "";
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-events",
      });
      imageUrl = uploadResponse.secure_url;
    }

    let reportPdfUrl = "";
    if (reportPdfBase64) {
      const uploadResponse = await cloudinary.uploader.upload(reportPdfBase64, {
        folder: "ppf-event-reports",
        resource_type: "auto",
      });
      reportPdfUrl = uploadResponse.secure_url;
    }

    // Generate unique eventId
    const eventId = `event-${Math.random().toString(36).substring(2, 11)}`;

    // Handle speakers formatting (from input speakers array, fallback to splitting speaker string by comma)
    let speakersArray = [];
    if (speakersInput && Array.isArray(speakersInput)) {
      speakersArray = speakersInput;
    } else if (speaker) {
      speakersArray = speaker.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const newEventData = {
      eventId,
      mode: modeInput || "In-Person",
      title: title || "PPF Discussion",
      venue: venue || "PPF HQ",
      date: date || new Date().toISOString().split("T")[0],
      fromTime: fromTime || "10:00 AM",
      endTime: toTime || "12:00 PM",
      speakers: speakersArray,
      center: centerTag || "",
      about: about || "",
      tag: centerTag || "Engagement",
      eventPoster: imageUrl || "",
      pdfLink: pdfLink || "",
      reportPdf: reportPdfUrl || "",
      subEvents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newEventResult = await Event.collection.insertOne(newEventData);
    const newEvent = { ...newEventData, _id: newEventResult.insertedId };

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
