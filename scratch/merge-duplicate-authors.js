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

async function mergeDuplicateAuthors() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const db = mongoose.connection.db;
  const authorsCol = db.collection("authors");
  const opinionsCol = db.collection("opinions");

  // Fetch all authors and opinions
  const allAuthors = await authorsCol.find({}).toArray();
  console.log(`Found ${allAuthors.length} total author documents in the database.`);

  // Group authors by name (trimmed and lowercased)
  const groupedAuthors = new Map();
  for (const author of allAuthors) {
    const cleanName = author.authorName.trim().toLowerCase();
    if (!groupedAuthors.has(cleanName)) {
      groupedAuthors.set(cleanName, []);
    }
    groupedAuthors.get(cleanName).push(author);
  }

  console.log(`Grouped into ${groupedAuthors.size} unique author names.`);
  console.log("\n--- Merging Duplicate Profiles ---");

  let mergedCount = 0;

  for (const [name, authorsList] of groupedAuthors.entries()) {
    if (authorsList.length <= 1) continue; // No duplicates for this name

    console.log(`\nFound ${authorsList.length} profiles for author name: "${authorsList[0].authorName}"`);

    // Sort to determine the primary author:
    // Prefer profiles that have an authorImage or an about biography, or the oldest one
    authorsList.sort((a, b) => {
      const aScore = (a.authorImage ? 10 : 0) + (a.about ? 5 : 0);
      const bScore = (b.authorImage ? 10 : 0) + (b.about ? 5 : 0);
      if (aScore !== bScore) return bScore - aScore; // Descending score
      return new Date(a.createdAt) - new Date(b.createdAt); // Ascending date (older first)
    });

    const primaryAuthor = authorsList[0];
    const duplicateAuthors = authorsList.slice(1);

    console.log(`-> SELECTED PRIMARY: ID "${primaryAuthor.authorId}" (_id: ${primaryAuthor._id})`);

    // Consolidate attributes
    let consolidatedImage = primaryAuthor.authorImage || "";
    let consolidatedAbout = primaryAuthor.about || "";
    let consolidatedSocialLinks = [...(primaryAuthor.socialLinks || [])];
    let consolidatedOpinions = primaryAuthor.opinionsWritten ? [...primaryAuthor.opinionsWritten] : [];

    for (const dup of duplicateAuthors) {
      console.log(`   * Duplicate to merge: ID "${dup.authorId}" (_id: ${dup._id})`);

      // Copy image if primary doesn't have one
      if (!consolidatedImage && dup.authorImage) {
        consolidatedImage = dup.authorImage;
      }
      // Copy biography if primary doesn't have one
      if (!consolidatedAbout && dup.about) {
        consolidatedAbout = dup.about;
      }
      // Merge social links
      if (dup.socialLinks) {
        for (const link of dup.socialLinks) {
          if (!consolidatedSocialLinks.includes(link)) {
            consolidatedSocialLinks.push(link);
          }
        }
      }
      // Merge opinions written list
      if (dup.opinionsWritten) {
        for (const opId of dup.opinionsWritten) {
          const opIdStr = opId.toString();
          if (!consolidatedOpinions.some(id => id.toString() === opIdStr)) {
            consolidatedOpinions.push(opId);
          }
        }
      }

      // REDIRECT OPINIONS: Scan opinions collection and update references from duplicate ID to primary ID
      const redirectResult = await opinionsCol.updateMany(
        { author: dup._id },
        { $set: { author: primaryAuthor._id } }
      );
      if (redirectResult.modifiedCount > 0) {
        console.log(`     > Redirected ${redirectResult.modifiedCount} opinion references.`);
      }

      // Delete the duplicate author record
      await authorsCol.deleteOne({ _id: dup._id });
      console.log(`     > Deleted duplicate profile document.`);
      mergedCount++;
    }

    // Update the primary author in the database with the consolidated arrays & text fields
    await authorsCol.updateOne(
      { _id: primaryAuthor._id },
      {
        $set: {
          authorImage: consolidatedImage,
          about: consolidatedAbout,
          socialLinks: consolidatedSocialLinks,
          opinionsWritten: consolidatedOpinions,
          updatedAt: new Date()
        }
      }
    );
    console.log(`   ✓ Updated primary profile with consolidated fields!`);
  }

  // Refresh counts
  const finalAuthors = await authorsCol.find({}).toArray();
  console.log(`\n--- MERGING PROCESS COMPLETE ---`);
  console.log(`Successfully merged and cleaned up ${mergedCount} duplicate author documents!`);
  console.log(`The 'authors' collection now has ${finalAuthors.length} clean, unique profiles.`);

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
}

mergeDuplicateAuthors().catch((err) => {
  console.error("Merging failed:", err);
  process.exit(1);
});
