"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCheckCircle, FaBullseye, FaStar, FaLandmark, FaUsers, FaBalanceScale, FaTimes } from "react-icons/fa";
import Link from "next/link";
import TeamContent from "@/components/team/TeamContent";

// ─── Animation helper ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

const objectives = [
  "Promoting informed debates, dialogues, and policy discussions on matters of national importance.",
  "Serving as a knowledge and research platform on issues relating to internal security, governance, and social stability.",
  "Strengthening social resilience and community participation through capacity building and grassroots engagement.",
  "Undertaking research, analysis, and advocacy on social, developmental, governance, and security-related issues affecting the nation.",
  "Collaborating with government institutions, civil society organisations, academia, and other stakeholders to encourage integrated and sustainable policy approaches.",
];

const competencies = [
  "Research and Policy Analysis",
  "Advocacy and Awareness Generation",
  "Training and Capacity Building",
  "Peace, Security, and Social Stability",
  "Disaster Management and Community Resilience",
  "Women Empowerment and Livelihood Development",
  "Governance and Public Policy",
  "Energy and Power Sector Studies",
  "Cyber Security and Emerging Challenges",
];

export default function AboutPage() {
  const clusterRef = useRef(null);

  // GSAP animation for the RHS circular cluster
  useEffect(() => {
    if (!clusterRef.current) return;
    const circles = clusterRef.current.querySelectorAll('.gsap-circle');
    
    // Entrance animation
    gsap.fromTo(circles, 
      { scale: 0.6, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "back.out(1.5)" }
    );
    
    // Floating animation
    circles.forEach((circle, i) => {
      gsap.to(circle, {
        y: i % 2 === 0 ? "-=12" : "+=12",
        duration: 2.5 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, []);

  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-[#F8FAFC]">
        {/* Minimal Hero */}
        <section className="bg-slate-900 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-lora font-black text-white">About Us</h1>
          </div>
        </section>

        <section className="py-12 md:py-16 px-6 lg:px-12 max-w-[1400px] mx-auto">
          {/* Main About Text & Image Cluster */}
          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-center mb-16">
            {/* LHS: Text */}
            <motion.div {...fadeUp(0)}>
               <div className="flex items-center gap-3 mb-6">
                 <span className="h-px w-8 bg-ppf-purple" />
                 <span className="text-ppf-purple font-lora font-black uppercase text-[10px] tracking-wider">Our Story</span>
               </div>
               
               <h2 className="text-3xl md:text-4xl font-lora font-bold text-slate-800 mb-6">
                 Policy Perspectives Foundation (PPF)
               </h2>
               
               <div className="space-y-6 text-slate-600 font-lato text-base md:text-lg leading-relaxed max-w-4xl">
                 <p>
                   Founded in 2005, the Policy Perspectives Foundation (PPF) is a non-profit and apolitical think tank dedicated to addressing issues of national importance with a focus on peace, stability, inclusive development, and social resilience in India. The organisation works on complex and interconnected social, developmental, and governance challenges through research, dialogue, capacity building, and community-oriented initiatives.
                 </p>
                 <p>
                   Over the years, PPF has engaged with scholars, policymakers, development practitioners, academic institutions, civil society organisations, and government stakeholders to encourage informed discussions and collaborative action. The Foundation undertakes research, training, community engagement and awareness programmes that seek to bridge the gap between policy discourse and grassroots realities, while contributing towards sustainable and inclusive development outcomes.
                 </p>
                 <p>
                   The work of PPF broadly spans capacity building, awareness generation, research, and social resilience initiatives. Drawing strength from a multidisciplinary network of experts and practitioners in the fields of strategic affairs, governance, sociology, communication, public policy, internal security, and development management, the Foundation continues to work towards creating informed, resilient, and empowered communities across diverse sectors.
                 </p>
               </div>

               <div className="flex flex-wrap gap-4 mt-10">
                 <button onClick={() => {
                   const teamSection = document.getElementById('team-section');
                   if (teamSection) {
                     teamSection.scrollIntoView({ behavior: 'smooth' });
                   }
                 }} className="flex items-center gap-3 bg-transparent border-2 border-ppf-teal text-ppf-teal px-8 py-4 uppercase tracking-widest hover:bg-ppf-purple hover:text-white transition-all shadow-md rounded-full font-lato font-extrabold text-sm">
                   <FaUsers className="font-bold text-md" />
                   Meet The Team
                 </button>
               </div>
            </motion.div>

            {/* RHS: Circular Image Cluster with GSAP */}
            <div ref={clusterRef} className="relative w-full aspect-[4/5] max-w-[550px] ml-auto hidden lg:block">
              {/* Decorative Background Elements */}
              <div className="absolute top-[30%] left-[10%] w-[80%] h-[80%] rounded-full bg-ppf-purple/5 blur-3xl -z-10"></div>
              <div className="absolute bottom-[10%] right-[10%] w-[60%] h-[60%] rounded-full bg-ppf-teal/5 blur-3xl -z-10"></div>

              {/* Big Circle (Main) */}
              <div className="gsap-circle absolute top-[25%] right-0 w-[65%] aspect-square rounded-full overflow-hidden border-[8px] border-white shadow-2xl z-20">
                <img src="/about_imgs/1.jpeg" alt="PPF Team" className="w-full h-full object-cover" />
              </div>
              
              {/* Medium Circle (Left Overlap) */}
              <div className="gsap-circle absolute top-[50%] left-0 w-[45%] aspect-square rounded-full overflow-hidden border-[6px] border-white shadow-xl z-30">
                <img src="/about_page/1.jpeg" alt="PPF Event" className="w-full h-full object-cover" />
              </div>
              
              {/* Small Circle (Top Left) */}
              <div className="gsap-circle absolute top-[15%] left-[20%] w-[35%] aspect-square rounded-full overflow-hidden border-[6px] border-white shadow-lg z-10">
                <img src="/about_page/2.jpg" alt="PPF Discussion" className="w-full h-full object-cover" />
              </div>
              
              {/* Small Circle (Bottom Right Overlap) */}
              <div className="gsap-circle absolute bottom-[5%] left-[25%] w-[38%] aspect-square rounded-full overflow-hidden border-[6px] border-white shadow-2xl z-40">
                <img src="/about_page/3.jpg" alt="PPF Community" className="w-full h-full object-cover" />
              </div>

              {/* Accent callout (Moved to RHS top, No Overlap) */}
              <motion.div 
                {...fadeLeft(0.5)}
                className="absolute top-0 right-0 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-ppf-purple/10 flex items-start gap-4 z-50 w-[85%] sm:w-[320px]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-ppf-purple/10 flex items-center justify-center text-ppf-purple">
                  <FaLandmark className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-lora font-bold text-ppf-purple uppercase tracking-wider mb-1">
                    Est. 2005 · New Delhi
                  </p>
                  <p className="text-slate-600 text-[11px] font-lato leading-relaxed">
                    Two decades of independent, evidence-based policy engagement across India&apos;s most critical governance and security challenges.
                  </p>
                </div>
              </motion.div>

              {/* Accent Dots */}
              <div className="gsap-circle absolute top-[50%] right-[8%] w-4 h-4 rounded-full bg-ppf-orange z-50 shadow-md"></div>
              <div className="gsap-circle absolute bottom-[15%] left-[5%] w-6 h-6 rounded-full bg-ppf-teal/80 z-0 shadow-md"></div>
              <div className="gsap-circle absolute top-[25%] left-[10%] w-3 h-3 rounded-full bg-ppf-purple z-50 shadow-md"></div>
            </div>
          </div>

          {/* --- LEGAL STATUS SECTION --- */}
          <div id="legal-status-section" className="mb-16 max-w-[1200px] mx-auto">
            <motion.div 
              {...fadeUp(0)}
              className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Left side: Heading */}
                <div className="md:w-1/3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ppf-purple/10 text-ppf-purple mb-6">
                    <FaBalanceScale className="text-3xl" />
                  </div>
                  <h3 className="text-3xl font-lora font-bold text-slate-800 mb-4">
                    Legal Status & Registration
                  </h3>
                  <p className="text-slate-600 font-lato leading-relaxed">
                    Committed to transparency, accountability, and rigorous compliance since our inception.
                  </p>
                </div>
                
                {/* Right side: Details Grid */}
                <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
                  {/* Registration Authority */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sm:col-span-2">
                    <p className="text-xs font-lora font-bold text-ppf-purple uppercase tracking-wider mb-2">Registration Authority</p>
                    <p className="text-slate-700 font-lato font-medium text-lg">
                      Registered in Delhi under the Societies Registration Act (XXI) of 1860.
                    </p>
                  </div>
                  
                  {/* Reg Number */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-xs font-lora font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Number</p>
                    <p className="text-ppf-purple font-lato font-black text-2xl">S/54267</p>
                  </div>
                  
                  {/* Reg Date */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-xs font-lora font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Date</p>
                    <p className="text-slate-800 font-lato font-black text-2xl">29 Nov 2005</p>
                  </div>
                  
                  {/* Tax Exemption */}
                  <div className="bg-ppf-purple/5 p-6 rounded-2xl shadow-sm border border-ppf-purple/10 sm:col-span-2">
                    <p className="text-xs font-lora font-bold text-ppf-purple uppercase tracking-wider mb-2">Tax Exemption Status</p>
                    <p className="text-slate-700 font-lato text-base leading-relaxed">
                      Registered under <span className="font-bold text-slate-900">Sections 12 A</span> and <span className="font-bold text-slate-900">80G (5)(VI)</span> of the Income Tax Act, 1961.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Objectives and Core Competencies from old About.js */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start max-w-[1200px] mx-auto">
            
            {/* ── Key Objectives ── */}
            <motion.div {...fadeLeft(0.1)} className="flex flex-col">
              <h3 className="text-2xl font-lora font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-ppf-purple/10 pb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ppf-purple/10 text-ppf-purple">
                  <FaBullseye className="text-base" />
                </span>
                Key Objectives
              </h3>
              <div className="space-y-4">
                {objectives.map((obj, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(0.05 * i)}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-ppf-purple/20 transition-all duration-300"
                  >
                    <div className="bg-ppf-purple/10 p-2 rounded-lg text-ppf-purple mt-0.5 flex-shrink-0">
                      <FaCheckCircle className="text-lg" />
                    </div>
                    <p className="text-slate-700 text-sm md:text-base font-lato leading-relaxed">
                      {obj}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Core Competencies ── */}
            <motion.div {...fadeRight(0.1)} className="flex flex-col">
              <h3 className="text-2xl font-lora font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-ppf-purple/10 pb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600">
                  <FaStar className="text-base" />
                </span>
                Core Competencies
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {competencies.map((comp, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(0.04 * i)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 h-full"
                  >
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full flex-shrink-0">
                      <FaCheckCircle className="text-sm" />
                    </div>
                    <span className="text-slate-700 text-sm md:text-base font-lato font-semibold leading-snug">
                      {comp}
                    </span>
                  </motion.div>
                ))}
              </div>

            </motion.div>

          </div>
        </section>

        {/* --- TEAM SECTION --- */}
        <section id="team-section">
          <TeamContent />
        </section>


      </main>

      <Footer />
    </div>
  );
}
