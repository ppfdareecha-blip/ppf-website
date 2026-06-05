import mongoose from "mongoose";

const UnApprovedOpinionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    tag: { type: String, default: "" },
    center: { type: String, default: "" },
    attachedPoster: { type: String, default: "" },
    downloadableLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.UnApprovedOpinion || mongoose.model("UnApprovedOpinion", UnApprovedOpinionSchema);
