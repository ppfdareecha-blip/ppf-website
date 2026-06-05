"use client";
import React, { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView, useScroll } from "framer-motion";
import { FaBookOpen, FaGlobeAmericas, FaUsers, FaChartLine, FaAward } from "react-icons/fa";

const stats = [
  { label: "Years of Policy Excellence", val: 20, suffix: "+", icon: FaAward, growth: "Est. 2005" },
  { label: "Research Papers", val: 500, suffix: "+", icon: FaBookOpen, growth: "+12% YoY" },
  { label: "Global Partners", val: 120, suffix: "+", icon: FaGlobeAmericas, growth: "+15 New" },
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
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      id="impact" 
      ref={containerRef}
      /* Removed relative z-10 to prevent creating a high stacking context */
      className="relative py-12 overflow-hidden bg-slate-200"
    >
      {/* Background Layer - Removed z-0 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          style={{ y: backgroundY }}
          className="relative w-full h-[120%] -top-[10%]"
        >
          <img 
            src="https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/Home/3.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </motion.div>
      </div>

      {/* Content Layer - Removed z-10 */}
      <div className={`${sectionWidth || 'max-w-6xl mx-auto'} relative px-6`}>
        
        <div className="mb-8 text-center lg:text-left">
          <motion.h2 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-3xl font-lora md:text-4xl font-black text-white leading-tight"
          >
            Impact <span className="text-ppf-teal">Expanding.</span>
          </motion.h2>
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="flex items-center gap-2 justify-center lg:justify-start mb-1 text-vibrant-violet font-bold uppercase tracking-[0.1em] text-md"
          >
            <FaChartLine />
            <span className="font-lato">Growth Trajectory</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="h-full p-6 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-lg shadow-lg flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-ppf-purple/30 rounded-full blur-2xl transition-all duration-500" />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 text-ppf-purple group-hover:bg-ppf-purple group-hover:text-white transition-all duration-300">
                      <stat.icon size={18} />
                    </div>
                  </div>

                  <div className="text-3xl md:text-3xl font-lora font-black text-slate-900 mb-1">
                    <Counter value={stat.val} suffix={stat.suffix} />
                  </div>
                </div>

                <div className="text-slate-500 font-lato font-bold uppercase text-[10px] tracking-[0.1em]">
                  {stat.label}
                </div>

                <div className="mt-4 h-1 w-full bg-slate-200/40 rounded-full overflow-hidden">
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