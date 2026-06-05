import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    pdfLink: { type: String, required: true },
    date: { type: String, default: "" },
    thumbnail: { type: String, default: "" }, // Optional cover image for the newsletter
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);
