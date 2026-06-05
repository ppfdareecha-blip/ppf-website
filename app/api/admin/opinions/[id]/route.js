import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";
import UnApprovedOpinion from "@/lib/models/UnApprovedOpinion";
import Author from "@/lib/models/Author";

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // 1. Find the pending opinion
    const pending = await UnApprovedOpinion.findById(id);
    if (!pending) {
      return NextResponse.json({ success: false, error: "Pending opinion not found" }, { status: 404 });
    }

    // 2. Find or create the Author in the dedicated collection
    let author = await Author.findOne({ authorName: pending.authorName });
    if (!author) {
      const generateShortId = () => Math.random().toString(36).substring(2, 6);
      const slugify = (text) =>
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const authorId = `author-${slugify(pending.authorName)}-${generateShortId()}`;

      author = await Author.create({
        authorId,
        authorName: pending.authorName,
        authorPosition: "Contributor", // Default position
      });
    }

    // 3. Create a document in the approved Opinion collection
    const opinionId = `opinion-${Math.random().toString(36).substring(2, 11)}`;
    const approvedOpinion = await Opinion.create({
      opinionId,
      title: pending.title,
      description: pending.description,
      author: author._id,
      tag: pending.tag || "Opinion",
      center: pending.center || "",
      attachedPoster: pending.attachedPoster || "",
      downloadableLink: pending.downloadableLink || "",
    });

    // 4. Update Author's publications list
    await Author.findByIdAndUpdate(author._id, {
      $push: { opinionsWritten: approvedOpinion._id },
    });

    // 5. Delete from UnApprovedOpinion collection
    await UnApprovedOpinion.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: approvedOpinion });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const opinion = await UnApprovedOpinion.findByIdAndDelete(id);
    if (!opinion) {
      return NextResponse.json({ success: false, error: "Pending opinion not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
