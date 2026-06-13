"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBanner from "@/components/publications/banner";
import ScholarsSection from "@/components/publications/researchReports";
import AnnualReportSection from "@/components/publications/annualReport";
import ProjectReport from "@/components/publications/projectReport";

// Updated Data Object for Reports
const publications = {
  researchReports: [
    {
      title: "Geopolitical Implications of Central Asian Trade Corridors",
      author: "Dr. Arvan Singh",
      date: "Feb 2026",
      tags: ["Strategy", "Trade"],
      img: "/pictures/banner-1.jpg.jpeg"
    },
    {
      title: "Cyber Resilience Frameworks for Critical Infrastructure",
      author: "Prof. K. Vijayan",
      date: "Dec 2025",
      tags: ["Security", "Tech"],
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=250&auto=format&fit=crop"
    },
  ],
  annualReports: [
    {
      id: "annual-report-2023-24",
      title: "Annual Report - Financial Year 2023-2024",
      version: "FY 2023-2024",
      date: "Financial Year 2023-2024",
      year: "2024",
      type: "PDF",
      category: "Audit",
      pages: 16,
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400",
      file: "/Annual Report 2023-24.pdf"
    },
    {
      id: "annual-report-2022-23",
      title: "Annual Report - Financial Year 2022-2023",
      version: "FY 2022-2023",
      date: "Financial Year 2022-2023",
      year: "2023",
      type: "PDF",
      category: "Audit",
      pages: 14,
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400",
      file: "/Annual Report 2022-2023.pdf"
    }
  ],
  projectReports: [
    {
      title: "Project Protsahan",
      source: "Women Empowerment, Livelihood Development, and Community Resilience",
      description: "Project Protsahan is a flagship initiative of the Policy Perspectives Foundation focused on women empowerment, livelihood generation, skill development, and community resilience. The initiative seeks to create sustainable socio-economic opportunities for women and vulnerable communities through training, capacity building, awareness programmes, and grassroots interventions.",
      date: "Ongoing",
      link: "#",
      status: "Ongoing"
    }
  ],
};

export default function PublicationsPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-900 font-lato [&_h1]:font-lora [&_h2]:font-lora [&_h3]:font-lora [&_h4]:font-lora [&_h5]:font-lora [&_h6]:font-lora overflow-x-hidden selection:bg-ppf-teal/30 selection:text-slate-900">

      {/* Decorative Background Elements Using Custom Colors */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[5%] -right-[5%] w-[45rem] h-[45rem] rounded-full bg-ppf-teal/15 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[40%] -left-[10%] w-[50rem] h-[50rem] rounded-full bg-ppf-purple/15 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute -bottom-[5%] right-[15%] w-[55rem] h-[55rem] rounded-full bg-ppf-orange/15 blur-[120px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />

        <main className="flex-grow">
          <ParallaxBanner />

          <div className="">
            {/* Section 1: Research Reports */}
            <ScholarsSection data={publications.researchReports} />

            {/* Section 2: Annual Reports */}
            <AnnualReportSection data={publications.annualReports} />

            {/* Section 3: Project Reports */}
            <ProjectReport
              projectData={publications.projectReports}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
