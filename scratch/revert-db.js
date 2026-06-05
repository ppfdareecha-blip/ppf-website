const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Parse .env.local for connection details
const dotenvPath = path.join(__dirname, "../.env.local");
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
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

async function revertDatabase() {
  const adminBackupPath = path.join(__dirname, "recovered_admin_opinions.json");
  const newBackupPath = path.join(__dirname, "recovered_new_opinions.json");

  let adminOpinions = [];
  let newOpinions = [];

  if (fs.existsSync(adminBackupPath)) {
    adminOpinions = JSON.parse(fs.readFileSync(adminBackupPath, "utf8"));
  }
  if (fs.existsSync(newBackupPath)) {
    newOpinions = JSON.parse(fs.readFileSync(newBackupPath, "utf8"));
  }

  if (adminOpinions.length === 0 && newOpinions.length === 0) {
    console.error("CRITICAL ERROR: No recovered backup files found!");
    console.log("Please run 'node scratch/read-oplog.js' first to extract your data from the operations log.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB for Revert...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const db = mongoose.connection.db;

  // Decide recovery strategy
  if (adminOpinions.length > 0) {
    console.log(`\nUsing STRATEGY A: Reverting to the absolute original pre-migration state (restoring 'adminopinions' with ${adminOpinions.length} records)...`);
    
    // Dropping collections
    const collectionsToDrop = ["opinions", "adminopinions", "authors", "unapprovedopinions"];
    const existingCollections = (await db.listCollections().toArray()).map(c => c.name);

    for (const col of collectionsToDrop) {
      if (existingCollections.includes(col)) {
        await db.collection(col).drop();
        console.log(`Dropped collection: ${col}`);
      }
    }

    // Insert original documents into adminopinions
    const processedAdminOps = adminOpinions.map(doc => {
      if (doc._id && typeof doc._id === "string" && doc._id.length === 24) {
        doc._id = new mongoose.Types.ObjectId(doc._id);
      } else if (doc._id && doc._id.$oid) {
        doc._id = new mongoose.Types.ObjectId(doc._id.$oid);
      }
      return doc;
    });

    await db.collection("adminopinions").insertMany(processedAdminOps);
    console.log(`Restored 'adminopinions' collection with ${processedAdminOps.length} documents!`);

  } else if (newOpinions.length > 0) {
    console.log(`\nUsing STRATEGY B: Restoring the first successful migration state (restoring 'opinions' with ${newOpinions.length} records)...`);

    // Dropping opinions & authors
    const collectionsToDrop = ["opinions", "authors", "unapprovedopinions"];
    const existingCollections = (await db.listCollections().toArray()).map(c => c.name);

    for (const col of collectionsToDrop) {
      if (existingCollections.includes(col)) {
        await db.collection(col).drop();
        console.log(`Dropped collection: ${col}`);
      }
    }

    // Reconstruct opinions
    const processedNewOps = newOpinions.map(doc => {
      if (doc._id && typeof doc._id === "string" && doc._id.length === 24) {
        doc._id = new mongoose.Types.ObjectId(doc._id);
      } else if (doc._id && doc._id.$oid) {
        doc._id = new mongoose.Types.ObjectId(doc._id.$oid);
      }
      if (doc.author && typeof doc.author === "string" && doc.author.length === 24) {
        doc.author = new mongoose.Types.ObjectId(doc.author);
      } else if (doc.author && doc.author.$oid) {
        doc.author = new mongoose.Types.ObjectId(doc.author.$oid);
      }
      return doc;
    });

    await db.collection("opinions").insertMany(processedNewOps);
    console.log(`Restored 'opinions' collection with ${processedNewOps.length} documents!`);

    // Fetch and restore authors from oplog
    const localDb = mongoose.connection.client.db("local");
    const oplog = localDb.collection("oplog.rs");
    const ops = await oplog.find({ ns: "test.authors", op: "i" }).toArray();
    if (ops.length > 0) {
      const authorDocs = ops.map(op => {
        const doc = op.o;
        if (doc._id && typeof doc._id === "string" && doc._id.length === 24) {
          doc._id = new mongoose.Types.ObjectId(doc._id);
        } else if (doc._id && doc._id.$oid) {
          doc._id = new mongoose.Types.ObjectId(doc._id.$oid);
        }
        if (doc.opinionsWritten && Array.isArray(doc.opinionsWritten)) {
          doc.opinionsWritten = doc.opinionsWritten.map(id => {
            if (typeof id === "string" && id.length === 24) return new mongoose.Types.ObjectId(id);
            if (id && id.$oid) return new mongoose.Types.ObjectId(id.$oid);
            return id;
          });
        }
        return doc;
      });

      // Deduplicate authors by ID
      const seenIds = new Set();
      const uniqueAuthors = [];
      for (const a of authorDocs) {
        const idStr = a._id.toString();
        if (!seenIds.has(idStr)) {
          seenIds.add(idStr);
          uniqueAuthors.push(a);
        }
      }

      await db.collection("authors").insertMany(uniqueAuthors);
      console.log(`Restored 'authors' collection with ${uniqueAuthors.length} unique documents from oplog!`);
    } else {
      console.log("No authors found in oplog. You can re-run the migration to extract authors again once the opinions are restored.");
    }
  }

  console.log("\nREVERT PROCESS COMPLETE! Your database has been successfully restored.");
  await mongoose.disconnect();
}

revertDatabase().catch((err) => {
  console.error("Revert error:", err);
});
