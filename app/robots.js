// ─── robots.js ────────────────────────────────────────────────────────────────
// Next.js 14 App Router automatically serves this at /robots.txt
// References the auto-generated sitemap.xml so Google never loses track.

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ppf.org.in";

export default function robots() {
    return {
        rules: [
            {
                // Allow all crawlers (Googlebot, Bingbot, etc.)
                userAgent: "*",
                allow: "/",
                // Block admin panel from being indexed
                disallow: ["/api/admin/", "/jkl/"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
