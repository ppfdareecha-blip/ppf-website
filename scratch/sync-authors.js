const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// 1. Parse .env.local for connection details
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

async function syncAuthors() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const db = mongoose.connection.db;
  const authorsCol = db.collection("authors");
  const opinionsCol = db.collection("opinions");

  // Read all existing authors in the database
  const authorsInDb = await authorsCol.find({}).toArray();
  console.log(`Found ${authorsInDb.length} authors in the database.`);

  // Load backup options to see if we can find author information
  let backupOpinions = [];
  const backupPath = path.join(__dirname, "recovered_new_opinions.json");
  if (fs.existsSync(backupPath)) {
    try {
      backupOpinions = JSON.parse(fs.readFileSync(backupPath, "utf8"));
      console.log(`Loaded backup file with ${backupOpinions.length} records.`);
    } catch (e) {
      console.log("Could not parse backup opinions file:", e.message);
    }
  }

  // Build a map of author profiles extracted from backup or opinions
  const authorProfiles = new Map(); // Key: authorName lowercased

  // First, extract author profiles from backup opinions
  for (const op of backupOpinions) {
    if (op.author) {
      const authorInfo = op.author;
      if (typeof authorInfo === "object" && authorInfo.name) {
        const nameKey = authorInfo.name.toLowerCase().trim();
        if (!authorProfiles.has(nameKey)) {
          authorProfiles.set(nameKey, {
            profilePictureUrl: authorInfo.profilePictureUrl || authorInfo.authorPictureLink || "",
            description: authorInfo.description || authorInfo.bio || authorInfo.about || "",
            socialLinks: authorInfo.socialLinks || []
          });
        }
      }
    }
  }

  console.log("\n--- Syncing & Backfilling Authors Schema ---");

  let updatedCount = 0;
  for (const author of authorsInDb) {
    const nameKey = author.authorName.toLowerCase().trim();
    const backupProfile = authorProfiles.get(nameKey) || {};

    // Determine values to write
    const finalImage = author.authorImage || author.authorPictureLink || author.authorImageLink || author.profilePictureUrl || backupProfile.profilePictureUrl || "";
    const finalBio = author.about || author.bio || author.description || backupProfile.description || "";
    const finalSocials = author.socialLinks || backupProfile.socialLinks || [];
    const finalOpinions = author.opinionsWritten || [];
    const authorId = author.authorId || `author-${author.authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    // Perform an explicit physical update of all schema properties in MongoDB
    const updateResult = await authorsCol.updateOne(
      { _id: author._id },
      {
        $set: {
          authorId: authorId,
          authorName: author.authorName,
          authorPosition: author.authorPosition,
          authorPictureLink: finalImage,
          authorImageLink: finalImage,
          authorImage: finalImage, // Explicit authorImage per request
          authorIdLink: `/pages/authors/${authorId}`,
          bio: finalBio,
          about: finalBio, // Explicit about biography per request
          socialLinks: finalSocials,
          opinionsWritten: finalOpinions,
          updatedAt: new Date()
        }
      }
    );

    console.log(`Updated Author: "${author.authorName}" -> Image: "${finalImage ? 'Yes' : 'None'}", About: "${finalBio ? 'Yes' : 'None'}"`);
    updatedCount++;
  }

  console.log(`\nSuccessfully backfilled and synchronized ${updatedCount} author profiles in the database!`);
  
  // Verify that the collections exist and lists them
  const collections = (await db.listCollections().toArray()).map(c => c.name);
  console.log("\nActive Database Collections:", collections);

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
}

syncAuthors().catch((err) => {
  console.error("Synchronization encountered an error:", err);
  process.exit(1);
});
