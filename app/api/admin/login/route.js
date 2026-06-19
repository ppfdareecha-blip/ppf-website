import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import {
  ADMIN_TOKEN_COOKIE,
  createAdminSession,
  hashPassword,
  setAdminSessionCookie,
  verifyPassword,
} from "@/lib/adminAuth";

export async function POST(req) {
  const ip = getClientIP(req);
  const limit = checkRateLimit(ip, { maxRequests: 10, windowMs: 15 * 60 * 1000 });

  if (!limit.allowed) {
    const waitMins = Math.ceil(limit.resetIn / 60000);
    return NextResponse.json(
      { success: false, error: `Too many login attempts. Please try again in ${waitMins} minute(s).` },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    let admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      const bootstrapEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
      const bootstrapPassword = process.env.ADMIN_PASSWORD;

      if (bootstrapEmail && bootstrapPassword && normalizedEmail === bootstrapEmail && password === bootstrapPassword) {
        const existingAdmins = await Admin.countDocuments();
        admin = await Admin.create({
          email: normalizedEmail,
          passwordHash: hashPassword(password),
          role: existingAdmins === 0 ? "super_admin" : "admin",
        });
      }
    }

    if (admin && verifyPassword(password, admin.passwordHash)) {
      admin.lastLoginAt = new Date();
      await admin.save();

      const token = createAdminSession(admin);
      const res = NextResponse.json({
        success: true,
        admin: { email: admin.email, role: admin.role },
      });
      setAdminSessionCookie(res, token);
      return res;
    }

    return NextResponse.json(
      { success: false, error: "The email or password entered is incorrect. Please try again." },
      { status: 401 }
    );
  } catch (e) {
    console.error("Admin login error:", e);
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
