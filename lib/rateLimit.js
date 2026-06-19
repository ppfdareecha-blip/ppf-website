/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses a Map to track request counts per IP within a sliding window.
 * 
 * Note: In-memory store resets on server restart (cold starts on Vercel).
 * For persistent rate limiting across serverless instances, use Upstash Redis.
 */

// Map structure: { ip -> { count, windowStart } }
const rateLimitStore = new Map();

/**
 * Extract the real client IP from the request headers.
 * Vercel forwards the original IP via x-forwarded-for.
 */
export function getClientIP(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first one
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1"; // fallback for local dev
}

/**
 * Check if the given IP is within the allowed rate limit.
 * 
 * @param {string} ip - The client IP address
 * @param {object} options
 * @param {number} options.maxRequests - Max allowed requests in the window (default: 5)
 * @param {number} options.windowMs - Window duration in milliseconds (default: 15 minutes)
 * @returns {{ allowed: boolean, remaining: number, resetIn: number }}
 */
export function checkRateLimit(ip, { maxRequests = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now - record.windowStart > windowMs) {
    // First request or window has expired — reset
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (record.count >= maxRequests) {
    const resetIn = windowMs - (now - record.windowStart);
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetIn: windowMs - (now - record.windowStart) };
}
