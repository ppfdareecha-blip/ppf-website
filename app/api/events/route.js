import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";

export const dynamic = 'force-dynamic';

function formatDateString(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    const formattedEvents = events.map((ev) => {
      // Map speakers array to a string representation for frontend if necessary,
      // or pass the first speaker for backward compatibility.
      const primarySpeaker = ev.speakers && ev.speakers.length > 0 ? ev.speakers[0] : "";

      return {
        id: ev._id.toString(),
        eventId: ev.eventId,
        title: primarySpeaker ? `Session with ${primarySpeaker}` : ev.title,
        eventTitle: ev.title,
        date: formatDateString(ev.date),
        time: `${ev.fromTime} - ${ev.endTime}`,
        location: ev.venue,
        type: ev.tag || "Engagement",
        image: ev.eventPoster || "/images/events/event1.jpg",
        summary: ev.venue,
        about: ev.title,
        speaker: primarySpeaker,
        speakers: ev.speakers || [],
        centerTag: ev.centers || ev.center || "",
        centers: ev.centers || ev.center || "",
        mode: ev.mode || "In-Person",
        subEvents: ev.subEvents || [],
        status: new Date(ev.date) >= new Date().setHours(0, 0, 0, 0) ? "upcoming" : "past",
      };
    });

    return NextResponse.json({ success: true, data: formattedEvents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
