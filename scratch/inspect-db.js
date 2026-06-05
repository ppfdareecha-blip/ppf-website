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

async function inspectCluster() {
  console.log("Connecting to MongoDB cluster...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const adminDb = mongoose.connection.client.db().admin();
  
  // 1. List all databases
  console.log("\n--- Listing All Databases ---");
  const dbs = await adminDb.listDatabases();
  for (const dbInfo of dbs.databases) {
    console.log(`Database name: ${dbInfo.name} (Size on disk: ${dbInfo.sizeOnDisk} bytes)`);
    
    // Connect to this specific database and list its collections
    const dbInstance = mongoose.connection.client.db(dbInfo.name);
    const collections = await dbInstance.listCollections().toArray();
    for (const col of collections) {
      const docCount = await dbInstance.collection(col.name).countDocuments();
      console.log(`  - Collection: ${col.name} (${docCount} documents)`);
    }
  }

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
}

inspectCluster().catch((err) => {
  console.error("Inspection error:", err);
});
