import mongoose from "mongoose";

// Connect directly to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ppf-website";

const OpinionSchema = new mongoose.Schema(
  {
    opinionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
    tag: { type: String, default: "" },
    center: { type: String, default: "" },
    publishedAt: { type: String, default: "" },
    attachedPoster: { type: String, default: "" },
    downloadableLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Opinion = mongoose.model("Opinion", OpinionSchema);

async function populateOpinionDates() {
  try {
    console.log("📚 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!");

    
    console.log("🔍 Fetching all opinions...");
    const opinions = await Opinion.find({});
    
    if (opinions.length === 0) {
      console.log("✅ No opinions found to update.");
      process.exit(0);
    }
    
    console.log(`📝 Found ${opinions.length} opinions. Populating publishedAt dates...`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const opinion of opinions) {
      // Skip if publishedAt already exists
      if (opinion.publishedAt && opinion.publishedAt.trim()) {
        skipped++;
        continue;
      }
      
      // Format createdAt in human-readable format
      const createdDate = new Date(opinion.createdAt);
      const formattedDate = createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      // Update the opinion
      opinion.publishedAt = formattedDate;
      await opinion.save();
      updated++;
      
      console.log(`✓ ${opinion.title}: "${formattedDate}"`);
    }
    
    console.log(`\n✅ Complete!`);
    console.log(`   • Updated: ${updated} opinions`);
    console.log(`   • Skipped: ${skipped} opinions (already had dates)`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

populateOpinionDates();
