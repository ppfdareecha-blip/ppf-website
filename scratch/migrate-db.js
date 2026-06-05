const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// 1. Manually parse .env.local for MONGODB_URI
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

// Helper to generate IDs
const generateShortId = () => Math.random().toString(36).substring(2, 11);
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function runMigration() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const db = mongoose.connection.db;

  // Fetch collections to check existence
  const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

  // Check if adminopinions exists or if we already migrated
  let rawAdminOpinions = [];
  try {
    if (existingCollections.includes("adminopinions")) {
      rawAdminOpinions = await db.collection("adminopinions").find({}).toArray();
    }
    console.log(`Found ${rawAdminOpinions.length} existing admin opinions.`);
  } catch (err) {
    console.log("Failed to read adminopinions:", err.message);
  }

  // --- DOUBLE-RUN SAFETY SHIELD ---
  if (rawAdminOpinions.length === 0 && existingCollections.includes("opinions") && !existingCollections.includes("adminopinions")) {
    console.log("\n========================================================");
    console.log("[SAFETY GUARD TRIGGERED]");
    console.log("It appears your database has already been successfully migrated!");
    console.log("The 'adminopinions' collection has been integrated into 'opinions'.");
    console.log("To prevent accidental data loss, this script will now exit safely");
    console.log("without modifying or dropping any of your active collections.");
    console.log("========================================================\n");
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log("Fetching raw documents from remaining collections...");

  let rawOpinions = [];
  try {
    if (existingCollections.includes("opinions")) {
      rawOpinions = await db.collection("opinions").find({}).toArray();
    }
    console.log(`Found ${rawOpinions.length} existing opinions.`);
  } catch (err) {
    console.log("Failed to read opinions:", err.message);
  }

  let rawEvents = [];
  try {
    if (existingCollections.includes("events")) {
      rawEvents = await db.collection("events").find({}).toArray();
    }
    console.log(`Found ${rawEvents.length} existing events.`);
  } catch (err) {
    console.log("Failed to read events:", err.message);
  }

  // 3. Clear/drop existing collections to rebuild with the new structures
  console.log("Dropping old collections to prepare for clean schema reconstruction...");
  const collectionsToDrop = ["opinions", "adminopinions", "events", "authors", "unapprovedopinions"];

  for (const colName of collectionsToDrop) {
    if (existingCollections.includes(colName)) {
      await db.collection(colName).drop();
      console.log(`Dropped collection: ${colName}`);
    }
  }

  // Define new collections
  const authorsCol = db.collection("authors");
  const opinionsCol = db.collection("opinions");
  const unapprovedOpinionsCol = db.collection("unapprovedopinions");
  const eventsCol = db.collection("events");

  // 4. Migrate and extract Authors
  console.log("Extracting and migrating unique authors...");
  const authorMapping = new Map(); // Key: name_position, Value: Author Document

  // Helper to get or create Author with bios and profile picture links
  const getOrCreateAuthor = async (name, position, profilePictureUrl = "", bio = "", socialLinks = []) => {
    const cleanName = name || "PPF Expert";
    const cleanPosition = position || "Expert Analyst";
    const key = `${cleanName.toLowerCase()}_${cleanPosition.toLowerCase()}`;

    if (authorMapping.has(key)) {
      return authorMapping.get(key);
    }

    const authorId = `author-${slugify(cleanName)}-${generateShortId()}`;
    const newAuthorDoc = {
      _id: new mongoose.Types.ObjectId(),
      authorId,
      authorName: cleanName,
      authorPosition: cleanPosition,
      authorPictureLink: profilePictureUrl || "",
      authorImageLink: profilePictureUrl || "",
      authorImage: profilePictureUrl || "", // Set migrated authorImage
      authorIdLink: `/pages/authors/${authorId}`,
      bio: bio || "",
      about: bio || "", // Set migrated about (biography)
      socialLinks: socialLinks || [],
      opinionsWritten: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await authorsCol.insertOne(newAuthorDoc);
    console.log(`Created Author Profile: ${cleanName} (${cleanPosition})`);
    authorMapping.set(key, newAuthorDoc);
    return newAuthorDoc;
  };

  // 5. Migrate opinions
  console.log("Migrating opinions...");

  // A. Process rawOpinions (from previous Opinion model - e.g. frontend user opinions)
  for (const rawOp of rawOpinions) {
    // Check status: in the old system rawOpinions had status: "pending" or "approved"
    if (rawOp.status === "approved") {
      // Migrate to new approved Opinion
      const authorDoc = await getOrCreateAuthor(rawOp.author, rawOp.level || "Member Contributor");
      const opinionId = `opinion-${generateShortId()}`;

      const newOpDoc = {
        _id: rawOp._id, // preserve database ID
        opinionId,
        title: rawOp.title || "Untitled Opinion",
        description: rawOp.content || "",
        author: authorDoc._id,
        tag: rawOp.category || "Opinion",
        center: "",
        attachedPoster: rawOp.image || "",
        downloadableLink: "",
        order: 0,
        createdAt: rawOp.createdAt || new Date(),
        updatedAt: rawOp.updatedAt || new Date(),
      };

      await opinionsCol.insertOne(newOpDoc);

      // Track in Author
      await authorsCol.updateOne(
        { _id: authorDoc._id },
        { $push: { opinionsWritten: newOpDoc._id } }
      );
    } else {
      // Migrate to UnApprovedOpinion
      const newUnapprovedDoc = {
        _id: rawOp._id,
        title: rawOp.title || "Untitled Pending Opinion",
        description: rawOp.content || "",
        authorName: rawOp.author || "Anonymous",
        authorEmail: rawOp.email || "pending@example.com",
        tag: rawOp.category || "Opinion",
        center: "",
        attachedPoster: rawOp.image || "",
        downloadableLink: "",
        createdAt: rawOp.createdAt || new Date(),
        updatedAt: rawOp.updatedAt || new Date(),
      };

      await unapprovedOpinionsCol.insertOne(newUnapprovedDoc);
      console.log(`Migrated Pending Opinion to UnApprovedOpinion: ${newUnapprovedDoc.title}`);
    }
  }

  // B. Process rawAdminOpinions (original official articles)
  for (const rawAdminOp of rawAdminOpinions) {
    const authorInfo = rawAdminOp.author || {};
    
    // Extract nested bio, picture URL, and socials to migrate them completely
    const authorDoc = await getOrCreateAuthor(
      authorInfo.name || "PPF Expert",
      authorInfo.position || "Expert Analyst",
      authorInfo.profilePictureUrl || "",
      authorInfo.description || "",
      authorInfo.socialLinks || []
    );
    
    const opinionId = rawAdminOp.slug || `opinion-${generateShortId()}`;

    const newOpDoc = {
      _id: rawAdminOp._id, // preserve original ID
      opinionId,
      title: rawAdminOp.title || "Untitled Article",
      description: rawAdminOp.description || "",
      author: authorDoc._id,
      tag: rawAdminOp.tag || "Insight",
      center: rawAdminOp.centerTag || "",
      attachedPoster: rawAdminOp.imageUrl || "",
      downloadableLink: "",
      order: rawAdminOp.order || 0,
      createdAt: rawAdminOp.createdAt || new Date(),
      updatedAt: rawAdminOp.updatedAt || new Date(),
    };

    await opinionsCol.insertOne(newOpDoc);

    // Track in Author
    await authorsCol.updateOne(
      { _id: authorDoc._id },
      { $push: { opinionsWritten: newOpDoc._id } }
    );
    console.log(`Migrated Admin Opinion to reconstructed Opinion collection: ${newOpDoc.title}`);
  }

  // 6. Migrate Events
  console.log("Migrating events to the reconstructed schema...");
  for (const rawEv of rawEvents) {
    const eventId = `event-${generateShortId()}`;
    const speakersArray = rawEv.speaker ? [rawEv.speaker] : [];

    const newEventDoc = {
      _id: rawEv._id, // preserve original ID
      eventId,
      mode: "In-Person", // Default to In-Person
      title: rawEv.title || "PPF Discussion",
      venue: rawEv.venue || "PPF HQ",
      date: rawEv.date || new Date().toISOString().split("T")[0],
      fromTime: rawEv.fromTime || "10:00 AM",
      endTime: rawEv.toTime || "12:00 PM",
      speakers: speakersArray,
      center: rawEv.centerTag || "",
      tag: rawEv.centerTag || "Engagement",
      eventPoster: rawEv.imageUrl || "",
      subEvents: [], // Empty initially
      createdAt: rawEv.createdAt || new Date(),
      updatedAt: rawEv.updatedAt || new Date(),
    };

    await eventsCol.insertOne(newEventDoc);
    console.log(`Migrated Event to new structure: ${newEventDoc.title}`);
  }

  // 7. Cleanup legacy model file AdminOpinion.js
  const adminModelPath = path.join(__dirname, "../lib/models/AdminOpinion.js");
  console.log("Checking legacy model file for removal:", adminModelPath);
  if (fs.existsSync(adminModelPath)) {
    fs.unlinkSync(adminModelPath);
    console.log("Successfully removed legacy model file: AdminOpinion.js");
  } else {
    console.log("Legacy model file AdminOpinion.js was already removed.");
  }

  console.log("\nDATABASE MIGRATION & RECONSTRUCTION COMPLETE!");
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

runMigration().catch((err) => {
  console.error("Migration encountered a fatal error:", err);
  process.exit(1);
});
