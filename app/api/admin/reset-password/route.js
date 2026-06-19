import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { hashPassword } from "@/lib/adminAuth";

export async function POST(req) {
  const ip = getClientIP(req);
  const limit = checkRateLimit(`reset:${ip}`, { maxRequests: 5, windowMs: 15 * 60 * 1000 });

  if (!limit.allowed) {
    const waitMins = Math.ceil(limit.resetIn / 60000);
    return NextResponse.json(
      { success: false, error: `Too many reset attempts. Please try again in ${waitMins} minute(s).` },
      { status: 429 }
    );
  }

  try {
    const { email, masterResetKey, newPassword } = await req.json();
    const configuredKey = process.env.MASTER_RESET_KEY;

    if (!configuredKey) {
      return NextResponse.json({ success: false, error: "Password reset is not configured." }, { status: 500 });
    }
    if (!email || !masterResetKey || !newPassword) {
      return NextResponse.json({ success: false, error: "Email, reset key, and new password are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "New password must be at least 8 characters." }, { status: 400 });
    }
    if (masterResetKey !== configuredKey) {
      return NextResponse.json({ success: false, error: "Invalid reset details." }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid reset details." }, { status: 401 });
    }

    admin.passwordHash = hashPassword(newPassword);
    await admin.save();

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Admin password reset error:", e);
    return NextResponse.json({ success: false, error: "Unable to reset password." }, { status: 400 });
  }
}
