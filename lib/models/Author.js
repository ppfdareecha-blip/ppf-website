import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true, unique: true, index: true },
    authorName: { type: String, required: true },
    authorPosition: { type: String, required: true },
    authorIdLink: { type: String, default: "" },
    authorImage: { type: String, default: "" },      // Single, consolidated field for storing author's profile picture
    about: { type: String, default: "" },            // Single, consolidated field for storing biography description
    socialLinks: [{ type: String }],
    opinionsWritten: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opinion" }],
  },
  { timestamps: true }
);

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);
