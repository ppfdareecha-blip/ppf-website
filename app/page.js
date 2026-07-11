"use client";
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
// import About from "@/components/home/About";
import Centers from "@/components/home/centers";
import ImpactStats from "@/components/home/ImpactStats";
import Activities from "@/components/home/Activites";
import Footer from "@/components/Footer";
import SupportQueries from "@/components/home/questions";
import MediaSection from "@/components/home/MediaSection";
import PodcastSection from "@/components/home/PodcastSection";
import CommunityOutreach from "@/components/home/CommunityOutreach";

export default function HomePage() {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsNavHidden(true);
    } else {
      setIsNavHidden(false);
    }
  });

  const sectionWidth = "max-w-[90%] mx-auto";

  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">
      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={isNavHidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <Navbar />
      </motion.div>

      <main className=" bg-[#F8FAFC]">
        <Hero sectionWidth={sectionWidth} />
        {/* <About sectionWidth={sectionWidth} /> */}
        <ImpactStats sectionWidth={sectionWidth} />
        <CommunityOutreach sectionWidth={sectionWidth} />
        <Centers sectionWidth={sectionWidth} />
        <Activities sectionWidth={sectionWidth} />
        <PodcastSection sectionWidth={sectionWidth} />
        <MediaSection sectionWidth={sectionWidth} />
        <SupportQueries sectionWidth={sectionWidth} />
      </main>

      <Footer sectionWidth={sectionWidth} />
    </div>
  );
}