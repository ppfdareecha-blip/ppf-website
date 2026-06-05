import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
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
    } = await req.json();

    let imageUrl = "";
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-events",
      });
      imageUrl = uploadResponse.secure_url;
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

    const newEvent = await Event.create({
      eventId,
      mode: modeInput || "In-Person",
      title: title || "PPF Discussion",
      venue: venue || "PPF HQ",
      date: date || new Date().toISOString().split("T")[0],
      fromTime: fromTime || "10:00 AM",
      endTime: toTime || "12:00 PM",
      speakers: speakersArray,
      center: centerTag || "",
      // centers field removed – using single 'center'
      about: about || "",
      tag: centerTag || "Engagement",
      eventPoster: imageUrl || "",
      pdfLink: pdfLink || "",
      subEvents: [],
    });

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
