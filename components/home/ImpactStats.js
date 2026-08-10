"use client";
import React, { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { FaBookOpen, FaGlobeAmericas, FaUsers, FaChartLine, FaAward, FaArrowRight } from "react-icons/fa";

const stats = [
  { label: "Years of Policy Excellence", val: 20, suffix: "+", icon: FaAward, growth: "Est. 2005" },
  { label: "Research Papers", val: 500, suffix: "+", icon: FaBookOpen, growth: "+12% YoY" },
  { label: "Partners", val: 120, suffix: "+", icon: FaGlobeAmericas, growth: "+15 New" },
  { label: "Network Size", val: 15000, suffix: "+", icon: FaUsers, growth: "+2.4k Monthly" }
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });
  const spring = useSpring(0, { stiffness: 30, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    if (inView) {
      spring.set(value);
    } else {
      spring.set(0);
    }
  }, [inView, spring, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>{suffix}
    </span>
  );
}

export default function ImpactStats({ sectionWidth }) {
  return (
    <section
      id="impact"
      className="relative w-full min-h-[33vh] flex flex-col justify-center py-6 lg:py-8 overflow-hidden bg-slate-200"
    >
      {/* Background Layer with CSS Parallax */}
      <div 
        className="absolute inset-0 bg-[url('/stats_bg.jpeg')] bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      </div>

      {/* Content Layer - Removed z-10 */}
      <div className={`${sectionWidth || 'max-w-6xl mx-auto'} w-full relative px-6`}>

        <div className="mb-4 lg:mb-6 text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 lg:gap-3 justify-center lg:justify-start text-[15px] sm:text-2xl lg:text-3xl font-lora font-black text-white leading-tight mb-1 whitespace-nowrap"
          >
            <FaChartLine className="text-ppf-teal text-[15px] sm:text-2xl lg:text-3xl font-thin shrink-0" />
            <span>Policy and Research <span className="text-ppf-teal">Initiatives</span></span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-1.5 lg:gap-4 mt-2 lg:mt-0"
          >
            <div className="text-vibrant-violet font-bold uppercase tracking-[0.1em] text-xs sm:text-sm lg:text-sm font-lato">
              Impact Expanding.
            </div>

            <a href="/pages/publications" className="group inline-flex items-center gap-1.5 bg-white/10 hover:bg-white text-white hover:text-ppf-purple border border-white/40 hover:border-white px-4 py-2 lg:px-6 lg:py-2 rounded-full font-bold uppercase tracking-widest text-[11px] lg:text-sm transition-all duration-300">
              View Publications
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 text-[11px] lg:text-sm" />
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="h-full p-4 sm:p-5 lg:p-5 rounded-lg lg:rounded-2xl border border-white/40 bg-white/80 backdrop-blur-lg shadow-lg flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-ppf-purple/30 rounded-full blur-xl transition-all duration-500" />

                <div>
                  <div className="flex justify-between items-start mb-1 lg:mb-2">
                    <div className="p-2.5 lg:p-3 rounded-md lg:rounded-lg bg-slate-50 text-ppf-purple group-hover:bg-ppf-purple group-hover:text-white transition-all duration-300">
                      <stat.icon size={24} className="lg:w-[24px] lg:h-[24px]" />
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl lg:text-3xl font-lora font-black text-slate-900 mb-1 lg:mb-2 whitespace-nowrap">
                    <Counter value={stat.val} suffix={stat.suffix} />
                  </div>
                </div>

                <div className="text-slate-500 font-lato font-bold uppercase text-xs sm:text-sm lg:text-xs tracking-widest break-words leading-tight">
                  {stat.label}
                </div>

                <div className="mt-2 lg:mt-3 h-0.5 lg:h-1 w-full bg-slate-200/40 rounded-full overflow-hidden shrink-0">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.2, delay: i * 0.15 }}
                    className="h-full bg-gradient-to-r from-ppf-purple to-ppf-teal"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}