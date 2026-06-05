import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
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

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    let imageUrl = existingEvent.eventPoster;
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-events",
      });
      imageUrl = uploadResponse.secure_url;
    }

    let speakersArray = existingEvent.speakers || [];
    if (speakersInput && Array.isArray(speakersInput)) {
      speakersArray = speakersInput;
    } else if (speaker !== undefined) {
      speakersArray = speaker.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        mode: modeInput || existingEvent.mode || "In-Person",
        title: title !== undefined ? title : existingEvent.title,
        venue: venue !== undefined ? venue : existingEvent.venue,
        date: date !== undefined ? date : existingEvent.date,
        fromTime: fromTime !== undefined ? fromTime : existingEvent.fromTime,
        endTime: toTime !== undefined ? toTime : existingEvent.endTime,
        speakers: speakersArray,
        about: about !== undefined ? about : existingEvent.about,
        center: centerTag !== undefined ? centerTag : existingEvent.center,
        // centers field removed – using single 'center'
        tag: centerTag !== undefined ? centerTag : existingEvent.tag,
        eventPoster: imageUrl,
        pdfLink: pdfLink !== undefined ? pdfLink : existingEvent.pdfLink,
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
