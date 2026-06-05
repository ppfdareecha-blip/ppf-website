import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/lib/models/Newsletter";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const newsletters = await Newsletter.find({}).sort({ createdAt: -1 }).lean();
    
    const formattedNewsletters = newsletters.map(n => ({
      id: n._id.toString(),
      title: n.title,
      description: n.description,
      pdfLink: n.pdfLink,
      thumbnail: n.thumbnail,
      date: n.date || new Date(n.createdAt).toLocaleDateString(),
    }));

    return NextResponse.json({ success: true, data: formattedNewsletters });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
