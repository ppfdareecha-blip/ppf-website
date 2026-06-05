import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/collaboration/herosection';
import WorkWithUsSection from '@/components/collaboration/workWithusSection';
import Courses from '@/components/collaboration/courses';
import Internship from '@/components/collaboration/Internships';
import Donate from '@/components/collaboration/donate';

import dbConnect from '@/lib/mongodb';
import Career from '@/lib/models/Career';

export const dynamic = 'force-dynamic';

const CollaborationPage = async () => {
  let jobs = [];
  let internships = [];
  let courses = [];

  try {
    await dbConnect();
    // Fetch only active postings, sorted by newest
    const careersData = await Career.find({ status: "active" }).sort({ createdAt: -1 }).lean();

    // Serialize database items (remove non-serializable BSON types)
    const serializedCareers = careersData.map(item => ({
      _id: item._id.toString(),
      type: item.type,
      title: item.title,
      category: item.category || "",
      description: item.description || "",
      location: item.location || "",
      duration: item.duration || "",
      stipend: item.stipend || "",
      price: item.price || "",
      startDate: item.startDate || "",
      requirements: item.requirements || "",
      responsibilities: item.responsibilities || "",
      applyLink: item.applyLink || "",
      image: item.image || "",
      status: item.status || "active"
    }));

    jobs = serializedCareers.filter(item => item.type === "job");
    internships = serializedCareers.filter(item => item.type === "intern");
    courses = serializedCareers.filter(item => item.type === "course");
  } catch (error) {
    console.error("Failed to fetch careers from database:", error);
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-lato [&_h1]:font-lora [&_h2]:font-lora [&_h3]:font-lora [&_h4]:font-lora [&_h5]:font-lora [&_h6]:font-lora overflow-x-hidden selection:bg-ppf-orange/30 selection:text-ppf-purple">
      
      {/* Decorative Background Elements Using Custom Colors */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[50rem] h-[50rem] rounded-full bg-ppf-purple/15 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40rem] h-[40rem] rounded-full bg-ppf-teal/15 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60rem] h-[60rem] rounded-full bg-ppf-orange/15 blur-[150px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar/>
        <HeroSection/>
        <WorkWithUsSection/>
        <Courses courses={courses} />
        <Internship jobs={jobs} internships={internships} />
        <Donate/>
        <Footer/>
      </div>
    </div>
  );
};

export default CollaborationPage;