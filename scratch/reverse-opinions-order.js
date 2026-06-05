// scratch/reverse-opinions-order.js
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

const OpinionSchema = new mongoose.Schema(
  {
    opinionId: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Opinion = mongoose.models.Opinion || mongoose.model("Opinion", OpinionSchema);

async function runMigration() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // Fetch all opinions sorted by createdAt ascending
    const opinions = await Opinion.find({}).sort({ createdAt: 1 });
    console.log(`Found ${opinions.length} total opinions.`);

    if (opinions.length === 0) {
      console.log("No opinions to migrate.");
      return;
    }

    // Collect all current createdAt and order values
    const originalTimes = opinions.map(op => op.createdAt);
    const originalOrders = opinions.map(op => op.order);

    // Reversing the arrays
    const reversedTimes = [...originalTimes].reverse();
    const reversedOrders = [...originalOrders].reverse();

    console.log("Starting bulk update...");
    const bulkOps = opinions.map((op, index) => {
      return {
        updateOne: {
          filter: { _id: op._id },
          update: {
            $set: {
              createdAt: reversedTimes[index],
              order: reversedOrders[index]
            }
          }
        }
      };
    });

    const result = await Opinion.bulkWrite(bulkOps);
    console.log(`Bulk update completed. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runMigration();
