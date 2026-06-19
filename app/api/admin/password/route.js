import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import { getAdminSession, hashPassword, requireAdmin, verifyPassword } from "@/lib/adminAuth";

export async function PUT(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Current password and new password are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const session = getAdminSession();
    await dbConnect();

    const admin = await Admin.findById(session.sub);
    if (!admin || !verifyPassword(currentPassword, admin.passwordHash)) {
      return NextResponse.json({ success: false, error: "Current password is incorrect." }, { status: 401 });
    }

    admin.passwordHash = hashPassword(newPassword);
    await admin.save();

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Admin password change error:", e);
    return NextResponse.json({ success: false, error: "Unable to change password." }, { status: 400 });
  }
}
