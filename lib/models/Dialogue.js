import mongoose from "mongoose";

const DialogueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    pdfLink: { type: String, default: "" },
    reportPdf: { type: String, default: "" },
    date: { type: String, required: true },
    sortDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Dialogue || mongoose.model("Dialogue", DialogueSchema);
