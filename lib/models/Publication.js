import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    publicationType: {
      type: String,
      required: true,
      enum: ["researchReport", "annualReport", "projectReport"],
      index: true,
    },
    // Common fields
    date: { type: String, default: "" },
    img: { type: String, default: "" },
    file: { type: String, default: "" }, // PDF link

    // Research Report fields
    author: { type: String, default: "" },
    tags: { type: [String], default: [] },

    // Annual Report (Audit) fields
    version: { type: String, default: "" },
    year: { type: String, default: "" },
    type: { type: String, default: "PDF" }, // e.g. PDF
    category: { type: String, default: "Audit" }, // e.g. Audit

    // Project Report fields
    source: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, default: "Ongoing" },
    link: { type: String, default: "" }, // Redirect / link
  },
  { timestamps: true }
);

export default mongoose.models.Publication || mongoose.model("Publication", PublicationSchema);
