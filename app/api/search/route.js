import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";
import Event from "@/lib/models/Event";
import Author from "@/lib/models/Author";
import Fuse from "fuse.js";
import opinionsData from "@/data/Opinions.json";
import eventsData from "@/data/Events.json";
import teamData from "@/data/Team.json";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  
  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, results: [] });
  }

  try {
    await dbConnect();
    
    // Fetch DB Data - gracefully handle if a collection fails
    let dbOpinions = [], dbEvents = [], dbAuthors = [];
    try { dbOpinions = await Opinion.find({}).lean(); } catch (e) { console.error(e); }
    try { dbEvents = await Event.find({}).lean(); } catch (e) { console.error(e); }
    try { dbAuthors = await Author.find({}).lean(); } catch (e) { console.error(e); }

    // Hardcoded static data
    const publications = [
      { title: "Geopolitical Implications of Central Asian Trade Corridors", author: "Dr. Arvan Singh", type: "Research Report", href: "/pages/publications/#scholars" },
      { title: "Cyber Resilience Frameworks for Critical Infrastructure", author: "Prof. K. Vijayan", type: "Research Report", href: "/pages/publications/#scholars" },
      { title: "PPF Annual Institutional Review 2025", type: "Annual Report", href: "/pages/publications/#annualReport" },
      { title: "Global Security Outlook: Annual Summary", type: "Annual Report", href: "/pages/publications/#annualReport" },
      { title: "Water Resource Management in the Himalayas", type: "Project Report", href: "/pages/publications/#projects" },
      { title: "Urban Sustainability & Smart City Implementation", type: "Project Report", href: "/pages/publications/#projects" }
    ];

    const courses = [
      { title: "Public Policy & Governance", category: "Foundations", href: "/pages/collaboration/#courses" },
      { title: "Data-Driven Legislations", category: "Advanced Analytics", href: "/pages/collaboration/#courses" },
      { title: "Diplomatic Communication", category: "Specialized", href: "/pages/collaboration/#courses" }
    ];

    const staticPages = [
      { title: "Media Gallery", content: "Photos, videos and social media updates from PPF events.", href: "/pages/Media" },
      { title: "Collaboration & Careers", content: "Internships, courses, and donation opportunities.", href: "/pages/collaboration" },
      { title: "Our Team", content: "Governing Council, Distinguished Fellows and Associates.", href: "/pages/team" },
      { title: "Publications", content: "Research reports, annual reports and project summaries.", href: "/pages/publications" }
    ];

    // Build Searchable Array
    const searchableData = [
      // 1. Static Opinions
      ...opinionsData.map(op => ({
        searchType: 'Opinion',
        searchTitle: op.title || '',
        searchContent: op.content || '',
        searchHref: `/pages/opinions/${op.id}`,
        id: op.id
      })),
      // 2. Dynamic Opinions
      ...dbOpinions.map(op => ({
        searchType: 'Opinion',
        searchTitle: op.title || '',
        searchContent: op.description || '',
        searchHref: `/pages/opinions/${op._id}`,
        id: op._id.toString()
      })),
      // 3. Static Events
      ...eventsData.map(ev => ({
        searchType: 'Event',
        searchTitle: ev.title || '',
        searchContent: ev.description || '',
        searchHref: `/pages/activities`,
        id: ev.id || Math.random().toString()
      })),
      // 4. Dynamic Events
      ...dbEvents.map(ev => ({
        searchType: 'Event',
        searchTitle: ev.title || '',
        searchContent: ev.description || ev.content || '',
        searchHref: `/pages/activities`,
        id: ev._id.toString()
      })),
      // 5. Static Team
      ...Object.entries(teamData).flatMap(([category, members]) => {
        if (!Array.isArray(members)) return [];
        return members.map(m => ({
          searchType: 'Team Member',
          searchTitle: m.name || '',
          searchContent: `${m.designation || ''} ${m.about || ''}`,
          searchHref: `/pages/team#${(m.name || '').replace(/\s+/g, '-').toLowerCase()}`,
          id: m.name || Math.random().toString()
        }));
      }),
      // 6. Dynamic Authors
      ...dbAuthors.map(a => ({
        searchType: 'Team Member',
        searchTitle: a.authorName || '',
        searchContent: a.authorDescription || a.authorPosition || '',
        searchHref: `/pages/authors/${a._id}`,
        id: a._id.toString()
      })),
      // 7. Publications
      ...publications.map(p => ({
        searchType: 'Publication',
        searchTitle: p.title,
        searchContent: p.author || p.type,
        searchHref: p.href,
        id: p.title
      })),
      // 8. Courses
      ...courses.map(c => ({
        searchType: 'Course',
        searchTitle: c.title,
        searchContent: c.category,
        searchHref: c.href,
        id: c.title
      })),
      // 9. Static Pages
      ...staticPages.map(s => ({
        searchType: 'Page',
        searchTitle: s.title,
        searchContent: s.content,
        searchHref: s.href,
        id: s.title
      }))
    ];

    // Remove Duplicates (e.g. if an opinion exists in both JSON and DB with same title)
    const uniqueMap = new Map();
    for (const item of searchableData) {
      if (item.searchTitle && !uniqueMap.has(item.searchTitle)) {
        uniqueMap.set(item.searchTitle, item);
      }
    }
    const uniqueSearchableData = Array.from(uniqueMap.values());

    const fuse = new Fuse(uniqueSearchableData, {
      keys: [
        { name: 'searchTitle', weight: 0.7 },
        { name: 'searchContent', weight: 0.3 }
      ],
      threshold: 0.4,
      includeMatches: true,
      minMatchCharLength: 2
    });

    const rawResults = fuse.search(query);
    
    const formattedResults = rawResults.map(result => {
      const item = result.item;
      // Safely extract substring to avoid errors
      let excerpt = typeof item.searchContent === 'string' ? item.searchContent : '';
      excerpt = excerpt.replace(/<[^>]*>?/gm, ''); // strip HTML
      excerpt = excerpt.substring(0, 65) + (excerpt.length > 65 ? '...' : '');

      return {
        type: item.searchType,
        title: item.searchTitle,
        excerpt: excerpt,
        href: item.searchHref,
        id: item.id
      };
    });

    return NextResponse.json({ success: true, results: formattedResults });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to perform search" }, { status: 500 });
  }
}
