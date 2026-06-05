import mongoose from "mongoose";

const OpinionSchema = new mongoose.Schema(
  {
    opinionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
    tag: { type: String, default: "" },
    center: { type: String, default: "" },
    attachedPoster: { type: String, default: "" },
    downloadableLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Opinion || mongoose.model("Opinion", OpinionSchema);
