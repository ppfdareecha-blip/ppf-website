import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "ppf_admin_token";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const HASH_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    ""
  );
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

  return `pbkdf2:${HASH_DIGEST}:${HASH_ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  const [scheme, digest, iterations, salt, originalHash] = storedHash.split(":");
  if (scheme !== "pbkdf2" || !digest || !iterations || !salt || !originalHash) return false;

  const hash = crypto
    .pbkdf2Sync(password, salt, Number(iterations), Buffer.from(originalHash, "hex").length, digest)
    .toString("hex");

  return timingSafeEqual(hash, originalHash);
}

export function createAdminSession(admin) {
  const secret = getSessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");

  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({
    sub: admin._id.toString(),
    email: admin.email,
    role: admin.role || "admin",
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  }));
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyAdminSession(token) {
  const secret = getSessionSecret();
  if (!token || !secret || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(res, token) {
  res.cookies.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export function requireAdmin() {
  const token = cookies().get(ADMIN_TOKEN_COOKIE)?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  return null;
}

export function getAdminSession() {
  const token = cookies().get(ADMIN_TOKEN_COOKIE)?.value;
  return verifyAdminSession(token);
}

export { ADMIN_TOKEN_COOKIE, SESSION_TTL_SECONDS };
