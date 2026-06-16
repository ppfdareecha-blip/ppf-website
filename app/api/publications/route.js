import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Publication from "@/lib/models/Publication";

export const dynamic = 'force-dynamic';

const initialPublications = [
  // Research Reports
  {
    publicationType: "researchReport",
    title: "Geopolitical Implications of Central Asian Trade Corridors",
    author: "Dr. Arvan Singh",
    date: "Feb 2026",
    tags: ["Strategy", "Trade"],
    img: "/pictures/banner-1.jpg.jpeg",
    file: ""
  },
  {
    publicationType: "researchReport",
    title: "Cyber Resilience Frameworks for Critical Infrastructure",
    author: "Prof. K. Vijayan",
    date: "Dec 2025",
    tags: ["Security", "Tech"],
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=250&auto=format&fit=crop",
    file: ""
  },
  // Annual Reports
  {
    publicationType: "annualReport",
    title: "Annual Report - Financial Year 2024-2025",
    version: "FY 2024-2025",
    date: "Financial Year 2024-2025",
    year: "2025",
    type: "PDF",
    category: "Audit",
    img: "/logo-circle.png",
    file: "/Annual Report 2024-2025.pdf"
  },
  {
    publicationType: "annualReport",
    title: "Annual Report - Financial Year 2023-2024",
    version: "FY 2023-2024",
    date: "Financial Year 2023-2024",
    year: "2024",
    type: "PDF",
    category: "Audit",
    img: "/logo-circle.png",
    file: "/Annual Report 2023-24.pdf"
  },
  {
    publicationType: "annualReport",
    title: "Annual Report - Financial Year 2022-2023",
    version: "FY 2022-2023",
    date: "Financial Year 2022-2023",
    year: "2023",
    type: "PDF",
    category: "Audit",
    img: "/logo-circle.png",
    file: "/Annual Report 2022-2023.pdf"
  },
  {
    publicationType: "annualReport",
    title: "Annual Report - Financial Year 2021-2022",
    version: "FY 2021-2022",
    date: "Financial Year 2021-2022",
    year: "2022",
    type: "PDF",
    category: "Audit",
    img: "/logo-circle.png",
    file: "/Annual Report 2021-2022.pdf"
  },
  {
    publicationType: "annualReport",
    title: "Annual Report - Financial Year 2020-2021",
    version: "FY 2020-2021",
    date: "Financial Year 2020-2021",
    year: "2021",
    type: "PDF",
    category: "Audit",
    img: "/logo-circle.png",
    file: "/Annual Report 2020-21.pdf"
  },
  {
    publicationType: "annualReport",
    title: "Annual Report - Financial Year 2019-2020",
    version: "FY 2019-2020",
    date: "Financial Year 2019-2020",
    year: "2020",
    type: "PDF",
    category: "Audit",
    img: "/logo-circle.png",
    file: "/Annual Report 2019-20.pdf"
  },
  // Project Reports
  {
    publicationType: "projectReport",
    title: "Project Protsahan",
    source: "Women Empowerment, Livelihood Development, and Community Resilience",
    description: "Project Protsahan is a flagship initiative of the Policy Perspectives Foundation focused on women empowerment, livelihood generation, skill development, and community resilience. The initiative seeks to create sustainable socio-economic opportunities for women and vulnerable communities through training, capacity building, awareness programmes, and grassroots interventions.",
    date: "Ongoing",
    link: "#",
    status: "Ongoing"
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    let publications = await Publication.find({}).sort({ createdAt: -1 }).lean();
    
    // Auto-seed if empty
    if (publications.length === 0) {
      await Publication.insertMany(initialPublications);
      publications = await Publication.find({}).sort({ createdAt: -1 }).lean();
    }

    // Group publications by type for frontend mapping
    const grouped = {
      researchReports: [],
      annualReports: [],
      projectReports: []
    };

    publications.forEach(pub => {
      let fileUrl = pub.file || "";
      // Only keep Cloudinary URLs; local paths (old seed data) are cleared
      if (fileUrl && !fileUrl.startsWith("http")) {
        fileUrl = "";
      }

      const pubObj = {
        id: pub._id.toString(),
        _id: pub._id.toString(),
        title: pub.title,
        date: pub.date,
        img: pub.img || "/logo-circle.png", // default fallback
        file: fileUrl,
        author: pub.author,
        tags: pub.tags || [],
        version: pub.version,
        year: pub.year,
        type: pub.type || "PDF",
        category: pub.category || "Audit",
        source: pub.source,
        description: pub.description,
        status: pub.status || "Ongoing",
        link: pub.link || fileUrl || "#"
      };

      if (pub.publicationType === "researchReport") {
        grouped.researchReports.push(pubObj);
      } else if (pub.publicationType === "annualReport") {
        grouped.annualReports.push(pubObj);
      } else if (pub.publicationType === "projectReport") {
        grouped.projectReports.push(pubObj);
      }
    });

    // Make sure research and annual reports maintain a reasonable order or fallback sorting
    // E.g., for annual reports, we can sort by year descending
    grouped.annualReports.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA;
    });

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
