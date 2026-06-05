"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OpinionsContent from "@/components/opinions/OpinionsContent";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Opinions() {
  const containerRef = useRef(null);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={containerRef} className="bg-white min-h-screen text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900">
      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={isNavHidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <Navbar />
      </motion.div>

      <OpinionsContent />

      <Footer />
    </div>
  );
}
