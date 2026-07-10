"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBanner from "@/components/publications/banner";
import ScholarsSection from "@/components/publications/researchReports";
import AnnualReportSection from "@/components/publications/annualReport";
import ProjectReport from "@/components/publications/projectReport";

export default function PublicationsPage() {
  const [data, setData] = useState({
    researchReports: [],
    annualReports: [],
    projectReports: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPublications = async () => {
      try {
        const res = await fetch("/api/publications", {
          cache: "no-store",
        });

        const json = await res.json();

        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load publications:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);


  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-900 font-lato [&_h1]:font-lora [&_h2]:font-lora [&_h3]:font-lora [&_h4]:font-lora [&_h5]:font-lora [&_h6]:font-lora overflow-x-hidden selection:bg-ppf-teal/30 selection:text-slate-900">

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[5%] -right-[5%] w-[45rem] h-[45rem] rounded-full bg-ppf-teal/15 blur-[120px] mix-blend-multiply"></div>

        <div className="absolute top-[40%] -left-[10%] w-[50rem] h-[50rem] rounded-full bg-ppf-purple/15 blur-[100px] mix-blend-multiply"></div>

        <div className="absolute -bottom-[5%] right-[15%] w-[55rem] h-[55rem] rounded-full bg-ppf-orange/15 blur-[120px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />

        <main className="flex-grow">
        <ParallaxBanner />

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-ppf-purple rounded-full animate-spin" />
            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading Publications...
            </p>
          </div>
         ) : (
          <>
            <ScholarsSection
              data={data.researchReports || []}
            />
      
            <AnnualReportSection
              data={data.annualReports || []}
            />

            {/* <ProjectReport
              projectData={data.projectReports || []}
            /> */}
          </>
              )}
         </main>

        <Footer />
      </div>
    </div>
  );
}