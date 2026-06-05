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
      id: "ppf-2025",
      title: "PPF Annual Institutional Review 2025",
      version: "FY 2024–25",
      date: "April 2026",
      year: "2026",
      type: "PDF",
      category: "Institutional",
      pages: 120,
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400",
      file: "#"
    },
    {
      id: "gso-2026",
      title: "Global Security Outlook: Annual Summary",
      version: "Vol. 14",
      date: "Jan 2026",
      year: "2026",
      type: "Digital",
      category: "Security",
      pages: 80,
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400",
      file: "#"
    }
  ],
  projectReports: [
    {
      title: "Water Resource Management in the Himalayas",
      source: "Himalayan Basin Project",
      date: "March 2026",
      link: "#",
      status: "Completed"
    },
    {
      title: "Urban Sustainability & Smart City Implementation",
      source: "Urban Future Initiative",
      date: "Nov 2025",
      link: "#",
      status: "Ongoing"
    },
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