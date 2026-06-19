import crypto from "crypto";
import fs from "fs";
import mongoose from "mongoose";

if (fs.existsSync(".env")) {
  const envFile = fs.readFileSync(".env", "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    process.env[key] ||= value;
  }
}

const [emailArg, passwordArg] = process.argv.slice(2);
const email = emailArg?.toLowerCase().trim();
const password = passwordArg || crypto.randomBytes(18).toString("base64url");

if (!email) {
  console.error("Usage: npm run reset-admin -- admin@example.org [new-password]");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

function hashPassword(value) {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 120000;
  const digest = "sha512";
  const hash = crypto.pbkdf2Sync(value, salt, iterations, 64, digest).toString("hex");
  return `pbkdf2:${digest}:${iterations}:${salt}:${hash}`;
}

await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });

const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
    lastLoginAt: Date,
  },
  { timestamps: true }
));

const existingAdmins = await Admin.countDocuments();
await Admin.updateOne(
  { email },
  {
    $set: { passwordHash: hashPassword(password) },
    $setOnInsert: { email, role: existingAdmins === 0 ? "super_admin" : "admin" },
  },
  { upsert: true }
);

await mongoose.disconnect();

console.log(`Admin password reset for ${email}`);
if (!passwordArg) {
  console.log(`Generated password: ${password}`);
}
