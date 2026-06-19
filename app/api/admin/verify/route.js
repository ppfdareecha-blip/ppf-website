import { NextResponse } from "next/server";
import { getAdminSession, requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/verify
 *
 * Lightweight endpoint used by the /jkl admin page on mount to check whether
 * the current browser session has a valid admin cookie.
 *
 * Returns:
 *   200 { success: true }  — session is valid
 *   401 { success: false } — no valid cookie (served by requireAdmin)
 */
export async function GET(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  const session = getAdminSession();
  return NextResponse.json({
    success: true,
    admin: session ? { email: session.email, role: session.role } : null,
  });
}
