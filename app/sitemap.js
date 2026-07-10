import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";
import Author from "@/lib/models/Author";

// ─── Your production domain ──────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ppf.org.in";

// ─── Static pages ─────────────────────────────────────────────────────────────
const staticRoutes = [
    { url: "/", priority: 1.0, changefreq: "weekly" },
    { url: "/pages/about", priority: 0.8, changefreq: "monthly" },
    { url: "/pages/opinions", priority: 0.9, changefreq: "daily" },
    { url: "/pages/publications", priority: 0.8, changefreq: "weekly" },
    { url: "/pages/activities", priority: 0.8, changefreq: "weekly" },
    { url: "/pages/authors", priority: 0.7, changefreq: "weekly" },
    { url: "/pages/centers", priority: 0.7, changefreq: "monthly" },
    { url: "/pages/collaboration", priority: 0.7, changefreq: "monthly" },
    { url: "/pages/newsletter", priority: 0.6, changefreq: "weekly" },
    { url: "/pages/Media", priority: 0.6, changefreq: "weekly" },
    { url: "/pages/search", priority: 0.5, changefreq: "monthly" },
];

export default async function sitemap() {
    const now = new Date();

    // ── 1. Static pages ──────────────────────────────────────────────────────
    const staticEntries = staticRoutes.map(({ url, priority, changefreq }) => ({
        url: `${BASE_URL}${url}`,
        lastModified: now,
        changeFrequency: changefreq,
        priority,
    }));

    // ── 2. Dynamic Opinion / Blog entries ────────────────────────────────────
    let opinionEntries = [];
    try {
        await dbConnect();
        const opinions = await Opinion.find({}, { opinionId: 1, updatedAt: 1, createdAt: 1 })
            .lean();

        opinionEntries = opinions
            .filter((op) => op.opinionId) // only published opinions with a valid ID
            .map((op) => ({
                url: `${BASE_URL}/pages/opinions/${op.opinionId}`,
                lastModified: op.updatedAt || op.createdAt || now,
                changeFrequency: "weekly",
                priority: 0.85,
            }));
    } catch (err) {
        console.error("[sitemap] Failed to fetch opinions:", err.message);
    }

    // ── 3. Dynamic Author pages ───────────────────────────────────────────────
    let authorEntries = [];
    try {
        await dbConnect();
        const authors = await Author.find({}, { authorId: 1, updatedAt: 1, createdAt: 1 })
            .lean();

        authorEntries = authors
            .filter((a) => a.authorId)
            .map((a) => ({
                url: `${BASE_URL}/pages/authors/${a.authorId}`,
                lastModified: a.updatedAt || a.createdAt || now,
                changeFrequency: "monthly",
                priority: 0.6,
            }));
    } catch (err) {
        console.error("[sitemap] Failed to fetch authors:", err.message);
    }

    return [...staticEntries, ...opinionEntries, ...authorEntries];
}
