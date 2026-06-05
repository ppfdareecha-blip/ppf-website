"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, ScrollText } from "lucide-react";
import { motion } from "framer-motion";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  // Updated with brand color: ppf-purple
  <div className="mb-10 border-l-4 border-ppf-purple pl-5">
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">
        {title}
      </h2>
    </div>
    <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
      {subtitle}
    </p>
  </div>
);

const ScholarCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="group relative flex flex-col sm:flex-row gap-6 p-6 bg-white border border-slate-200 rounded-xl hover:shadow-xl hover:border-ppf-purple/30 transition-all duration-500 overflow-hidden"
  >
    {/* Hover Accent Strip using ppf-purple */}
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-ppf-purple transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

    {/* Image Container */}
    <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden rounded-lg shadow-inner bg-slate-100">
      <Image
        src={item.img}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, 160px"
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />
      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />

      {/* Tag using ppf-orange for high visibility */}
      <span className="absolute top-3 left-3 bg-ppf-orange text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-tighter">
        {item.tags?.[0] || "Research"}
      </span>
    </div>

    {/* Content Area */}
    <div className="flex flex-col justify-between flex-1 py-1">
      <div>
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-ppf-purple leading-snug transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-3 text-base text-slate-500 leading-relaxed line-clamp-2">
          {item.description || "In-depth research and policy analysis addressing contemporary global challenges."}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Icon background using ppf-teal for a soft professional touch */}
            <div className="p-1.5 bg-ppf-teal/10 rounded-full">
              <GraduationCap size={16} className="text-ppf-teal" />
            </div>
            <span className="text-sm font-bold text-slate-700">{item.author}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-xs">
            <BookOpen size={14} className="text-ppf-purple/60" />
            <span className="font-medium">{item.date}</span>
          </div>
        </div>

        <button className="flex items-center gap-2 text-sm font-black text-ppf-purple uppercase tracking-wider group/btn">
          Access
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function ScholarsSection({ data = [] }) {
  return (
    <section id="scholars" className="w-full py-16 px-6 bg-white">
      <SectionHeader
        icon={ScrollText}
        title="Research Reports"
        subtitle="Access high-impact policy research and strategic insights authored by our leading scholars and domain experts."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {data.map((item, i) => (
          <ScholarCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}