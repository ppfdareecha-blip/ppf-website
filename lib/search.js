import Fuse from 'fuse.js';
import opinions from '../data/Opinions.json';
import events from '../data/Events.json';
import team from '../data/Team.json';

// Hardcoded data from components (should ideally be moved to JSON later)
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

// Flatten the data into a single searchable array
const searchableData = [
  ...opinions.map(op => ({
    ...op,
    searchType: 'Opinion',
    searchTitle: op.title || '',
    searchContent: op.content || '',
    searchHref: `/pages/opinions/${op.id}`
  })),
  ...events.map(ev => ({
    ...ev,
    searchType: 'Event',
    searchTitle: ev.title || '',
    searchContent: ev.description || '',
    searchHref: `/pages/activities`
  })),
  ...Object.entries(team).flatMap(([category, members]) => {
    if (!Array.isArray(members)) return [];
    return members.map(m => ({
      ...m,
      searchType: 'Team Member',
      searchTitle: m.name || '',
      searchContent: `${m.designation || ''} ${m.about || ''}`,
      searchHref: `/pages/team#${(m.name || '').replace(/\s+/g, '-').toLowerCase()}`
    }));
  }),
  ...publications.map(p => ({
    searchType: 'Publication',
    searchTitle: p.title,
    searchContent: p.author || p.type,
    searchHref: p.href
  })),
  ...courses.map(c => ({
    searchType: 'Course',
    searchTitle: c.title,
    searchContent: c.category,
    searchHref: c.href
  })),
  ...staticPages.map(s => ({
    searchType: 'Page',
    searchTitle: s.title,
    searchContent: s.content,
    searchHref: s.href
  }))
];

const fuseOptions = {
  keys: [
    { name: 'searchTitle', weight: 0.7 },
    { name: 'searchContent', weight: 0.3 }
  ],
  threshold: 0.4,
  includeMatches: true,
  minMatchCharLength: 2
};

const fuse = new Fuse(searchableData, fuseOptions);

export function searchGlobal(query) {
  if (!query || query.length < 2) return [];

  const results = fuse.search(query);
  
  return results.slice(0, 15).map(result => {
    const item = result.item;
    return {
      type: item.searchType,
      title: item.searchTitle,
      excerpt: item.searchContent.substring(0, 65) + '...',
      href: item.searchHref,
      id: item.id || item.name || item.searchTitle
    };
  });
}
