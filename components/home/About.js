"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaCheckCircle, FaBalanceScale, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

export default function About({ sectionWidth }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- SCROLL LOCK LOGIC ---
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  // --- CAROUSEL LOGIC ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/about_imgs/1.jpeg",
    "/about_imgs/2.jpeg",
    "/about_imgs/3.JPG",
    "/about_imgs/4.jpeg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const objectives = [
    "Promote and support debates and dialogues on matters of national interest.",
    "Act as a one-stop destination for studies relating to management of internal security.",
    "Promote social resilience through capacity building at the grass roots.",
    "Undertake research and analysis of social and security issues affecting the nation.",
    "Work with stakeholders to explore options for an integrated policy framework."
  ];

  const itemAnimate = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section id="about" className={`relative py-24 px-6 z-10 ${sectionWidth}`}>
      <div className="grid md:grid-cols-2 gap-16 items-start container mx-auto">
        
        {/* LEFT COLUMN: Mission & Vision + Objectives */}
        <motion.div {...itemAnimate} className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-ppf-purple" />
            <span className="text-ppf-purple font-lora font-black uppercase  text-[10px]">About Us</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-lora font-bold text-slate-800 mb-6 ">
            Matters of <span className="text-ppf-purple">National</span> Interest.
          </h2>


          <div className="space-y-4 text-vibrant-charcoal/80 font-lato leading-relaxed mb-8 text-base md:text-lg">
            <p>
              The Policy Perspectives Foundation (PPF) was founded in 2005 as a non-profit and apolitical think-tank. 
              The organisation focuses on complex challenges to internal peace, stability, and development in India.
            </p>
          </div>

          <div className="bg-ppf-purple/10 p-8 rounded-2xl border border-ppf-orange/20 mb-10 shadow-sm">
            <h4 className="text-ppf-purple font-lora font-bold uppercase tracking-widest text-xs mb-4">Salient Objectives</h4>
            <ul className="space-y-4">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-lato leading-snug">
                  <FaCheckCircle className="text-ppf-teal mt-0.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 bg-ppf-purple text-white px-8 py-4 font-lato font-extrabold uppercase tracking-widest hover:bg-ppf-purple/90 transition-all shadow-xl text-sm rounded-full"
            >
              <FaBalanceScale className="text-md" />
              Legal Status
            </button>
            <Link href="/pages/team">
              <button className="flex items-center gap-3 bg-transparent border-2 border-ppf-teal text-ppf-teal px-8 py-4 uppercase tracking-widest hover:bg-ppf-purple hover:text-white transition-all shadow-md rounded-full font-lato font-extrabold text-sm">
                <FaUsers className="font-bold text-md" />
                Meet The Team
              </button>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Carousel */}
        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="text-slate-600 font-lato leading-relaxed text-base"
          >
            <p className="mb-4">
              PPF promotes debates and dialogues with scholars, practitioners, and civil society. 
              Our activities fall under three categories: <b className="text-ppf-purple">capacity building</b>, <b className="text-ppf-purple">generation of awareness</b>, 
              and <b className="text-ppf-purple">social resilience</b>.
            </p>
            <p className="italic text-sm border-l-4 border-ppf-purple/30 pl-4 font-lato">
              We draw strength from experts in strategic affairs, security, sociology, and governance.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-[20px_20px_0px_0px_rgb(180,132,175)] bg-slate-100 h-[450px]">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentIndex}
                  src={images[currentIndex]} 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                  alt={`PPF Team ${currentIndex + 1}`} 
                  className="absolute inset-0 object-cover w-full h-full" 
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-ppf-purple/60 via-transparent to-transparent pointer-events-none" />

              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-ppf-purple p-3 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
                <FaChevronLeft size={18} />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-ppf-purple p-3 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
                <FaChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

{/* --- LEGAL STATUS MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-mono-plum/20 backdrop-blur-md"
            />
            
            {/* Reduced max-w-lg to max-w-md for a smaller overall width */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-vibrant-offwhite rounded-[1.5rem] shadow-2xl overflow-hidden border border-vibrant-violet/20"
            >
              <div className="bg-mono-plum p-4 flex justify-between items-center text-vibrant-offwhite">
                <h3 className="font-helvetica font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <FaBalanceScale className="text-vibrant-violet" /> Legal Status
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                  <FaTimes size={16} />
                </button>
              </div>
              
              {/* Reduced padding from p-10 to p-6 and tightened spacing */}
              <div className="p-6 space-y-6 font-futura">
                <div className="border-b border-vibrant-gray pb-4">
                  <p className="text-[9px] font-helvetica font-black text-vibrant-violet uppercase mb-1 tracking-widest">Registration Authority</p>
                  <p className="text-vibrant-charcoal font-bold text-base">
                    Registered in Delhi under the Societies Registration Act (XXI) of 1860.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-vibrant-gray p-4 rounded-xl">
                    <p className="text-[8px] font-helvetica font-bold text-vibrant-charcoal/50 uppercase mb-0.5 tracking-widest">Reg Number</p>
                    <p className="text-vibrant-violet font-black text-lg">S/54267</p>
                  </div>
                  <div className="bg-vibrant-gray p-4 rounded-xl">
                    <p className="text-[8px] font-helvetica font-bold text-vibrant-charcoal/50 uppercase mb-0.5 tracking-widest">Reg Date</p>
                    <p className="text-vibrant-charcoal font-black text-lg">29 Nov 2005</p>
                  </div>
                </div>

                <div className="bg-mono-lilac p-4 rounded-xl border border-vibrant-violet/10">
                  <p className="text-[9px] font-helvetica font-black text-vibrant-violet uppercase mb-1 tracking-widest">Tax Exemption Status</p>
                  <p className="text-vibrant-charcoal text-xs leading-relaxed">
                    Registered under <span className="font-bold text-mono-plum">Sections 12 A</span> and <span className="font-bold text-mono-plum">80G (5)(VI)</span> of the Income Tax Act, 1961.
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-vibrant-gray/50 text-center border-t border-vibrant-gray">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-vibrant-violet text-vibrant-offwhite px-8 py-2.5 rounded-full font-helvetica font-bold text-[9px] uppercase tracking-widest hover:bg-mono-plum transition-colors shadow-lg"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}