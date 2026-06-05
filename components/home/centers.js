"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaPlus } from "react-icons/fa";
import Link from "next/link";

const centers = [
  { 
    name: 'Centre for Women and Child Welfare', 
    abbr: 'PPF-CWCW', 
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/1.jpg' 
  },
  { 
    name: 'Centre for New Technologies', 
    abbr: 'PPF-CNT', 
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/2.jpg' 
  },
  { 
    name: 'Centre for Neighbourhood Studies', 
    abbr: 'PPF-CNS', 
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/3.jpg' 
  },
  { 
    name: 'Centre for Disaster Risk Reduction and Management', 
    abbr: 'PPF-CDRRM', 
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/4.jpg' 
  },
  { 
    name: 'Centre for Cohesive Society Studies', 
    abbr: 'PPF-CCSS', 
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/5.jpg' 
  },
  { 
    name: 'Centre for Radicalisation and Security Studies', 
    abbr: 'PPF-CRSS', 
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/6.jpg' 
  },
  { 
    name: 'Centre for Equity and Diversity Studies', 
    abbr: 'PPF-CEDS', 
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/7.jpg' 
  }
];

export default function Centers({ sectionWidth }) {
  return (
    <section id="centers" className="py-20 bg-[#f8f7ff]">
      <div className={sectionWidth || "max-w-7xl mx-auto px-6"}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-ppf-purple" />
            <span className="text-ppf-purple font-lato font-bold uppercase text-[10px]">
              Specialized Divisions
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-lora font-bold text-vibrant-charcoal mb-6 leading-tight">
            Centers of Excellence
          </h2>
          <p className="text-slate-600 text-lg font-lato max-w-2xl leading-relaxed">
            Independent research wings focused on shaping policy through 
            <span className="text-ppf-orange font-semibold"> data-driven analysis</span> and strategic foresight.
          </p>
        </motion.div>

        {/* Two-Part Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centers.map((center, i) => (
            <Link 
              key={i} 
              href={`/pages/centers/${center.abbr.toLowerCase()}`}
              className="block h-full"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 cursor-pointer"
              >
                {/* TOP PART: IMAGE */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img 
                    src={center.img} 
                    alt={center.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  
                  {/* Abbreviation Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    <span className="text-ppf-purple font-lato font-bold text-[10px] tracking-widest uppercase">
                      {center.abbr.split('-')[1]}
                    </span>
                  </div>
                </div>

                {/* BOTTOM PART: CONTENT */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <p className="text-ppf-purple font-lato font-bold text-[9px] uppercase tracking-[0.2em] mb-2 opacity-70">
                    {center.abbr}
                  </p>
                  <h3 className="text-slate-800 text-lg font-lora font-bold leading-snug mb-4 group-hover:text-ppf-purple transition-colors flex-grow">
                    {center.name}
                  </h3>
                  
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-lato font-bold text-slate-400 uppercase tracking-widest group-hover:text-ppf-purple transition-colors">
                      Explore Research
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-ppf-purple flex items-center justify-center transition-all duration-300">
                      <FaArrowRight className="text-slate-800 group-hover:text-white text-[10px] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
          
          {/* Join Us / Expanding Card */}
          <motion.div 
             className="group flex flex-col justify-center items-center h-full min-h-[320px] rounded-2xl border-2 border-dashed border-ppf-purple/20 p-8 text-center bg-white/40 hover:bg-white hover:border-ppf-purple/40 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-ppf-purple/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaPlus className="text-ppf-purple text-lg" />
            </div>
            <h4 className="text-slate-800 font-lora font-bold text-base mb-2">New Initiatives</h4>
            <p className="text-slate-500/60 font-lato text-xs leading-relaxed mb-4">
              Expanding our research horizons with upcoming centers in 2026.
            </p>
            <span className="inline-block px-4 py-1.5 rounded-full bg-ppf-purple/5 text-ppf-purple text-[9px] font-lato font-bold uppercase tracking-widest">
              Coming Soon
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}