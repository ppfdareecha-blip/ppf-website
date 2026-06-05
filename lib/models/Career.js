import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["job", "intern", "course"],
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String, // E.g., "Foundations", "Advanced Analytics", or Job Department
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String, // E.g., "Remote", "New Delhi", "Online", "In-Person"
      default: "",
    },
    duration: {
      type: String, // E.g., "6 Weeks", "3 Months"
      default: "",
    },
    stipend: {
      type: String, // E.g., "Unpaid", "₹15,000/mo"
      default: "",
    },
    price: {
      type: String, // E.g., "Free", "₹1,500"
      default: "",
    },
    startDate: {
      type: String, // E.g., "2026-07-01"
      default: "",
    },
    requirements: {
      type: String, // Qualifications / Eligibility criteria
      default: "",
    },
    responsibilities: {
      type: String, // Duties / Syllabus/Outline
      default: "",
    },
    applyLink: {
      type: String, // Application Form or Registration Link
      default: "",
    },
    image: {
      type: String, // Image URL / poster / course banner
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Career || mongoose.model("Career", CareerSchema);
