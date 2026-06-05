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

async function cleanupSchema() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const db = mongoose.connection.db;
  const authorsCol = db.collection("authors");

  console.log("\n--- Cleaning Up Redundant Fields from Authors Collection ---");
  
  // Use $unset to remove redundant properties completely
  const result = await authorsCol.updateMany(
    {},
    {
      $unset: {
        authorPictureLink: "",
        authorImageLink: "",
        bio: "",
        profilePictureUrl: "",
        description: ""
      }
    }
  );

  console.log(`Successfully updated documents: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
  console.log("Old fields (authorPictureLink, authorImageLink, bio, profilePictureUrl, description) have been successfully deleted from all database records!");

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
}

cleanupSchema().catch((err) => {
  console.error("Cleanup script failed:", err);
  process.exit(1);
});
