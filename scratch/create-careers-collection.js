const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Parse .env.local for connection details
const dotenvPath = path.join(__dirname, "../.env.local");
console.log("Loading environment from:", dotenvPath);
if (fs.existsSync(dotenvPath)) {
  const content = fs.readFileSync(dotenvPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// Inline Career schema for migration script execution
const CareerSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ["job", "intern", "course"] },
    title: { type: String, required: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    duration: { type: String, default: "" },
    stipend: { type: String, default: "" },
    price: { type: String, default: "" },
    startDate: { type: String, default: "" },
    requirements: { type: String, default: "" },
    responsibilities: { type: String, default: "" },
    applyLink: { type: String, default: "" },
    image: { type: String, default: "" },
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  { timestamps: true }
);

const Career = mongoose.models.Career || mongoose.model("Career", CareerSchema);

async function runMigration() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const db = mongoose.connection.db;

  // 1. Explicitly check / create collection
  console.log("Checking collections...");
  const collections = await db.listCollections({ name: "careers" }).toArray();
  if (collections.length === 0) {
    console.log("Creating 'careers' collection...");
    await db.createCollection("careers");
    console.log("'careers' collection created!");
  } else {
    console.log("'careers' collection already exists!");
  }

  // 2. Create indices for faster filtering and search queries
  console.log("Creating indices...");
  const careersCol = db.collection("careers");
  await careersCol.createIndex({ type: 1 });
  await careersCol.createIndex({ status: 1 });
  await careersCol.createIndex({ createdAt: -1 });
  console.log("Indices (type, status, createdAt) created successfully!");

  // 3. Check for existing documents to avoid duplicate seed runs
  const count = await careersCol.countDocuments();
  if (count === 0) {
    console.log("Seeding initial starter documents for Jobs, Internships, and Courses...");

    const seedData = [
      {
        type: "job",
        title: "Senior Research Associate (Security Studies)",
        category: "Security Studies",
        description: "We are looking for a Senior Research Associate to lead research projects in regional security, conflict resolution, and intelligence frameworks. The role involves drafting policy briefs, coordinating with key government stakeholders, and managing project milestones.",
        location: "New Delhi HQ (Hybrid)",
        duration: "",
        stipend: "Competitive, based on experience",
        price: "",
        startDate: "",
        requirements: "• Master's or Ph.D. in International Relations, Strategic Studies, or related fields.\n• Minimum 3-5 years of policy research experience.\n• Exceptional written and verbal communication skills.",
        responsibilities: "• Direct research initiatives and author policy publications.\n• Present findings at national security roundtables.\n• Mentor junior research interns.",
        applyLink: "https://forms.gle/ppf-job-apply-placeholder",
        image: "",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: "intern",
        title: "Public Policy Intern",
        category: "Neighbourhood Studies",
        description: "PPF is seeking passionate, detail-oriented interns to assist our research coordinators in the Neighbourhood Studies division. The intern will conduct literature reviews, monitor regional news sources, and assist in event planning.",
        location: "Remote / Online",
        duration: "3 Months",
        stipend: "₹10,000/month",
        price: "",
        startDate: "July 1, 2026",
        requirements: "• Current graduate student or recent graduate in Political Science, Economics, or Public Policy.\n• Strong analytical and monitoring skills.\n• Ability to dedicate 30 hours per week.",
        responsibilities: "• Draft weekly newsletters monitoring developments in South Asia.\n• Assist in transcribing meetings and discussion groups.\n• Conduct basic quantitative/qualitative data analysis.",
        applyLink: "https://forms.gle/ppf-intern-apply-placeholder",
        image: "",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: "course",
        title: "Public Policy & Legislative Drafting Masterclass",
        category: "Foundations",
        description: "A comprehensive course introducing students and policy professionals to the foundations of public policy formulation, legislative design, and data-driven analysis. Led by former IAS and IPS senior leaders.",
        location: "Online (Zoom)",
        duration: "6 Weeks",
        stipend: "",
        price: "Free (Registration Required)",
        startDate: "September 5, 2026",
        requirements: "• Open to undergraduate/postgraduate students, lawyers, and industry professionals.\n• High interest in Indian governance structures.",
        responsibilities: "• Week 1: Introduction to Policy Networks and Governance.\n• Week 2: Role of Executive and Judiciary in Policymaking.\n• Week 3: Basics of Legislative Drafting.\n• Week 4: Case Studies in Crisis Management.\n• Week 5: Data Analytics for Policies.\n• Week 6: Capstone Project & Peer Feedback.",
        applyLink: "https://forms.gle/ppf-course-enroll-placeholder",
        image: "https://raw.githubusercontent.com/Khushi-bhaskar01/PPF-Website-assets/main/collaboration-1.jpg",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await careersCol.insertMany(seedData);
    console.log("Successfully seeded 3 starter items in the database!");
  } else {
    console.log(`Database already has ${count} career documents. Skipping seeding.`);
  }

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB. Migration completed successfully!");
}

runMigration().catch((err) => {
  console.error("Migration script failed:", err);
  process.exit(1);
});
