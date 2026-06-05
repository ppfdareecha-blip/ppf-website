import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    mode: { type: String, required: true }, // online / in-person
    title: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true },
    fromTime: { type: String, required: true },
    endTime: { type: String, required: true },
    speakers: [{ type: String }],
    center: { type: String, default: "" },
    // centers field removed – use single 'center' field
    about: { type: String, default: "" },
    tag: { type: String, default: "" },
    eventPoster: { type: String, default: "" },
    pdfLink: { type: String, default: "" },
    subEvents: [{ type: String }], // Array of sub-event IDs, empty by default
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
