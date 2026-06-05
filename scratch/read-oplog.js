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

async function readOplog() {
  console.log("Connecting to MongoDB local oplog...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const localDb = mongoose.connection.client.db("local");
  const oplog = localDb.collection("oplog.rs");

  console.log("Querying oplog operations...");
  const ops = await oplog.find({}).toArray();
  console.log(`Retrieved ${ops.length} operations from oplog.`);

  let recoveredAdminOpinions = [];
  let recoveredNewOpinions = [];

  for (const op of ops) {
    const ns = op.ns || "";
    const operationType = op.op || ""; // 'i' = insert

    if (operationType === "i") {
      if (ns === "test.adminopinions") {
        recoveredAdminOpinions.push(op.o);
      } else if (ns === "test.opinions") {
        recoveredNewOpinions.push(op.o);
      }
    }
  }

  console.log(`\nFound ${recoveredAdminOpinions.length} inserts for 'test.adminopinions' in oplog.`);
  console.log(`Found ${recoveredNewOpinions.length} inserts for 'test.opinions' in oplog.`);

  // Write recovered data to a JSON file so we can verify and use it
  if (recoveredAdminOpinions.length > 0) {
    const backupPath = path.join(__dirname, "recovered_admin_opinions.json");
    fs.writeFileSync(backupPath, JSON.stringify(recoveredAdminOpinions, null, 2), "utf8");
    console.log(`Saved recovered admin opinions to: ${backupPath}`);
  }

  if (recoveredNewOpinions.length > 0) {
    const backupPath = path.join(__dirname, "recovered_new_opinions.json");
    fs.writeFileSync(backupPath, JSON.stringify(recoveredNewOpinions, null, 2), "utf8");
    console.log(`Saved recovered new opinions to: ${backupPath}`);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

// Run
readOplog().catch((err) => {
  console.error("Error reading oplog:", err);
});
