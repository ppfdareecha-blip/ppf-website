import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Dialogue from "@/lib/models/Dialogue";

export async function GET() {
  try {
    await dbConnect();
    const dialogues = await Dialogue.find({}).sort({ date: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: dialogues });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
