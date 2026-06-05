// migrate-multiple-authors.js
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// 1. Manually parse .env.local for MONGODB_URI
const dotenvPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(dotenvPath)) {
  const envConfig = fs.readFileSync(dotenvPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// Define Schemas inline to avoid importing Next.js alias paths
const OpinionSchema = new mongoose.Schema(
  {
    opinionId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
  },
  { timestamps: true }
);

const Opinion = mongoose.models.Opinion || mongoose.model("Opinion", OpinionSchema);

async function runMigration() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const opinions = await Opinion.find({});
    console.log(`Found ${opinions.length} total opinions.`);

    let migratedCount = 0;
    for (const op of opinions) {
      let updated = false;

      // Ensure authors array is initialized
      if (!op.authors) {
        op.authors = [];
        updated = true;
      }

      // If authors is empty and single author is set, push it
      if (op.author && op.authors.length === 0) {
        op.authors.push(op.author);
        updated = true;
      }

      if (updated) {
        await op.save();
        migratedCount++;
        console.log(`Migrated opinion: "${op.title}" -> added author "${op.author}" to authors array.`);
      }
    }

    console.log(`Migration complete! Updated ${migratedCount} opinions.`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runMigration();
