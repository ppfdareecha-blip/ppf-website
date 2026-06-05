"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const carouselImages = [
  {
    src: "/hero_imgs/1.jpeg",
    title: "Drone Policy 2.0 Roundtable",
    description: "Policy Perspectives Foundation Forum",
  },
  {
    src: "/hero_imgs/2.JPG",
    title: "National DRR Conference",
    description: "Fostering strategic conversations and national resilience",
  },
  {
    src: "/hero_imgs/3.JPG",
    title: "Technology & Security Forum",
    description: "Analyzing emerging security landscapes and advisory",
  },
  {
    src: "/hero_imgs/4.JPG",
    title: "Strategic Advisory Roundtable",
    description: "Delivering research-backed socio-economic insights",
  },
  {
    src: "/hero_imgs/5.jpeg",
    title: "AI Governance & Cybersecurity",
    description: "Deep-dive policy studies on new-age tech systems",
  },
];

// heheh

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const quickLinks = [
    { name: "About Foundation", href: "#about" },
    { name: "Research Centers", href: "#centers" },
    { name: "Impact", href: "#impact" },
    { name: "Team", href: "/pages/team" },
    { name: "Activities", href: "#activities" },
  ];

  // Auto advance slide every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section className="relative min-h-[90vh] md:h-screen w-full flex flex-col bg-gradient-to-r from-[#f9ecff] via-white to-white overflow-hidden">
      
      {/* --- UPPER HERO CONTENT (SPLIT LAYOUT TO PREVENT OVERLAPPING) --- */}
      <div className="flex-grow flex flex-col lg:flex-row w-full relative z-10">
        
        {/* Left Column: Main Content */}
        <div className="w-full lg:w-[44%] flex flex-col justify-center pl-6 md:pl-10 lg:pl-16 pt-32 lg:pt-32 pb-12">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="h-[2px] w-8 bg-ppf-purple" />
              <span className="text-ppf-purple font-helvetica font-bold text-[10px] uppercase tracking-[0.4em]">
                Think Tank & Research
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left text-black text-2xl md:text-5xl font-helvetica font-bold mb-5 leading-tight"
            >
              Spreading Awareness<br />
              Building Capacity<br />
              <span className="text-mono-deep">Promoting Resilience</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-600 font-lato text-base md:text-lg max-w-lg mb-8 leading-relaxed"
            >
              Policy Perspectives Foundation (PPF) is an independent think-tank 
              shaping the 21st century through <span className="text-ppf-orange font-semibold border-b-2 border-ppf-orange/20">deep-dive analysis</span> and 
              socio-economic insights.
            </motion.p>

            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.4 }}
               className="flex flex-wrap gap-4"
            >
              <Link href="/pages/publications">
                <button className="group flex items-center gap-3 bg-ppf-teal hover:bg-ppf-teal/90 text-ppf-purple px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-ppf-purple/20 rounded-full active:scale-95">
                  View Publications
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Hero Image Slider */}
        <div 
          className="w-full lg:w-[56%] h-[40vh] sm:h-[50vh] lg:h-auto min-h-[350px] lg:min-h-0 relative overflow-hidden group cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={(e) => {
            // Prevent manual click on controls from double triggering next slide
            if (e.target.closest('button') || e.target.closest('a')) return;
            handleNext();
          }}
        >
          {/* Gradient Overlays to blend the images smoothly */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/90 via-white/40 lg:via-white/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/80 via-transparent to-transparent lg:hidden pointer-events-none" />

          {/* Images Transition Stack */}
          {carouselImages.map((image, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-0" : "opacity-0 -z-10"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  style={{
                    animationName: isActive ? "kenburns" : "none",
                    animationDuration: "7s",
                    animationTimingFunction: "ease-out",
                    animationFillMode: "forwards",
                    animationPlayState: isPaused ? "paused" : "running",
                  }}
                  className="h-full w-full object-cover origin-center"
                />
              </div>
            );
          })}



          {/* Capsule Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/35 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
            {carouselImages.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    isActive ? "w-10 bg-white/30" : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {isActive && (
                    <div
                      style={{
                        animationName: "fillProgress",
                        animationDuration: "6s",
                        animationTimingFunction: "linear",
                        animationFillMode: "forwards",
                        animationPlayState: isPaused ? "paused" : "running",
                      }}
                      className="absolute top-0 left-0 bottom-0 bg-white"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* --- QUICK LINKS BAR --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-20 w-full bg-white/50 backdrop-blur-xl border-t border-ppf-purple/10 py-6"
      >
        <div className="container mx-auto pl-6 md:pl-10 lg:pl-16 pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-ppf-teal rounded-full hidden sm:block" />
              <div>
                <p className="text-ppf-purple text-[9px] font-bold uppercase tracking-[0.3em]">Est. 2005</p>
                <p className="text-ppf-purple font-helvetica font-bold text-xs">Shaping Global Security</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 text-slate-600 hover:text-ppf-purple text-[11px] font-lato font-bold uppercase tracking-wider transition-colors duration-300"
                >
                  {link.name}
                  <FaChevronRight className="text-[8px] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- CORE STYLES --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fillProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes kenburns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.06);
          }
        }
      `}} />
    </section>
  );
}