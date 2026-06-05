import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    // Legacy single slots
    youtubeVideoId: { type: String, default: "" },
    instagramPostUrl: { type: String, default: "" },
    linkedinUrn: { type: String, default: "" },
    xPostUrl: { type: String, default: "" },

    // Public Media page slots
    youtubeVideoIds: { type: [String], default: [] },
    instagramPostUrls: { type: [String], default: [] },
    linkedinUrns: { type: [String], default: [] },
    xPostUrls: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model("Media", MediaSchema);
