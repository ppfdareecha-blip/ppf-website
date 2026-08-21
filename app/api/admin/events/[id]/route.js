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
      reportPdfBase64,
      clearReportPdf,
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

    let reportPdfUrl = existingEvent.reportPdf;
    if (clearReportPdf) {
      reportPdfUrl = "";
      if (existingEvent.reportPdf) {
        try {
          const urlParts = existingEvent.reportPdf.split('/');
          const versionIndex = urlParts.findIndex(p => p.startsWith('v') && !isNaN(p.substring(1)));
          if (versionIndex !== -1) {
            const publicIdWithExt = urlParts.slice(versionIndex + 1).join('/');
            const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Failed to delete old PDF:", err);
        }
      }
    } else if (reportPdfBase64) {
      const uploadResponse = await cloudinary.uploader.upload(reportPdfBase64, {
        folder: "ppf-event-reports",
        resource_type: "auto",
      });
      console.log("Cloudinary Upload Response:", uploadResponse);
      reportPdfUrl = uploadResponse.secure_url;

      // Delete old PDF from cloudinary
      if (existingEvent.reportPdf) {
        try {
          const urlParts = existingEvent.reportPdf.split('/');
          const versionIndex = urlParts.findIndex(p => p.startsWith('v') && !isNaN(p.substring(1)));
          if (versionIndex !== -1) {
            const publicIdWithExt = urlParts.slice(versionIndex + 1).join('/');
            const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Failed to delete old PDF:", err);
        }
      }
    }

    let speakersArray = existingEvent.speakers || [];
    if (speakersInput && Array.isArray(speakersInput)) {
      speakersArray = speakersInput;
    } else if (speaker !== undefined) {
      speakersArray = speaker.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updateData = {
      mode: modeInput || existingEvent.mode || "In-Person",
      title: title !== undefined ? title : existingEvent.title,
      venue: venue !== undefined ? venue : existingEvent.venue,
      date: date !== undefined ? date : existingEvent.date,
      fromTime: fromTime !== undefined ? fromTime : existingEvent.fromTime,
      endTime: toTime !== undefined ? toTime : existingEvent.endTime,
      speakers: speakersArray,
      about: about !== undefined ? about : existingEvent.about,
      center: centerTag !== undefined ? centerTag : existingEvent.center,
      tag: centerTag !== undefined ? centerTag : existingEvent.tag,
      eventPoster: imageUrl,
      pdfLink: pdfLink !== undefined ? pdfLink : existingEvent.pdfLink,
      reportPdf: reportPdfUrl,
    };

    const updatedEvent = await Event.collection.findOneAndUpdate(
      { _id: existingEvent._id },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: updatedEvent.value || updatedEvent });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
