import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UnApprovedOpinion from "@/lib/models/UnApprovedOpinion";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const pendingOpinions = await UnApprovedOpinion.find({}).sort({ createdAt: -1 });
    
    // Normalize data slightly to match the frontend dashboard expectations
    const formattedopinions = pendingOpinions.map((op) => {
      const initials = op.authorName
        ? op.authorName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : "AN";

      const dateStr = op.createdAt
        ? new Date(op.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Recent";

      return {
        id: op._id.toString(),
        user: op.authorName,
        text: op.description,
        date: dateStr,
        avatar: initials,
        level: "Guest Contributor",
        image: op.attachedPoster,
        title: op.title,
      };
    });

    return NextResponse.json({ success: true, data: formattedopinions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
