"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ParallaxBanner() {
  return (
    <section className="relative py-10 px-6 overflow-hidden min-h-[240px] flex items-center bg-slate-950">

      {/* --- BACKGROUND IMAGE LAYER (PURE CSS PARALLAX) --- */}
      <div
        className="absolute inset-0 z-0 scale-110"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/Home/4.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* --- LAYERED OVERLAYS --- */}
      {/* Gradient uses a dark slate to transition into the brand ppf-purple tint */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#3b2050] via-[#3b2050]/80  to-transparent" />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-20 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          

          {/* Main Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 uppercase">
              Research &
              <span className="text-vibrant-offwhite tracking-wide uppercase">
                {" "} Publications
              </span>
            </h1>

            {/* Border using brand teal for a sophisticated accent */}
            <div className="border-l-[1.5px] border-ppf-teal/40 pl-5">
              <p className="text-slate-200/80 text-sm md:text-base max-w-lg leading-relaxed font-light">
                Bridging the gap between policy and practice.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Brand Blur */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-ppf-purple/10 blur-[80px] rounded-full pointer-events-none" />
    </section>
  );
}