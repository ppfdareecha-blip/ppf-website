"use client";

import Image from "next/image";
import { FileText, Download, Calendar, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-12 border-l-4 border-ppf-purple pl-6">
    <div className="flex items-center gap-4 mb-3">
      <Icon className="text-ppf-purple w-8 h-8" />
      <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight">
        {title}
      </h2>
    </div>
    <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed font-futura">
      {subtitle}
    </p>
  </div>
);

export default function AnnualReportSection({ data = [] }) {
  const [yearFilter, setYearFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const years = ["All", ...new Set(data.map((d) => d.year))].sort().reverse();
  const types = ["All", ...new Set(data.map((d) => d.type))];

  const filteredData = data.filter((item) => {
    return (
      (yearFilter === "All" || item.year === yearFilter) &&
      (typeFilter === "All" || item.type === typeFilter)
    );
  });

  return (
    <section id="annualReport" className="w-full px-6 py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          icon={FileText}
          title="Annual Review"
          subtitle="Audit reports, yearly publications, and institutional reviews. Filter by year or category to find specific documentation."
        />

        {/* --- FILTER BLOCK --- */}
        <div className="bg-white rounded-3xl p-8 mb-12 border border-ppf-purple/10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end gap-10">
            
            {/* Year Selection - Updated to Dropdown */}
            <div className="flex-1 w-full lg:max-w-xs">
              <label className="block text-[11px] font-black text-ppf-purple uppercase tracking-[0.2em] mb-4">
                Reporting Year
              </label>
              <div className="relative">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl focus:outline-none focus:border-ppf-purple transition-all cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y === "All" ? "All Years" : y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ppf-purple">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* Type Selection - Fixed Visibility */}
            <div className="flex-[2]">
              <label className="block text-[11px] font-black text-ppf-purple uppercase tracking-[0.2em] mb-4">
                Report Category
              </label>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-6 py-2 text-sm font-bold rounded-full border-2 transition-all duration-300
                      ${
                        typeFilter === t
                          ? "bg-ppf-teal text-ppf-purple border-ppf-teal shadow-lg shadow-ppf-teal/20"
                          : "bg-white text-slate-600 border-slate-200 hover:border-ppf-teal/40 hover:text-ppf-teal"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- REPORT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredData.map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-ppf-purple/10 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative w-full sm:w-48 h-56 sm:h-auto flex-shrink-0">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ppf-purple/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 left-4 bg-ppf-orange text-white px-3 py-1 text-[9px] font-black uppercase rounded-full shadow-lg">
                  {item.type}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-ppf-purple transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ppf-teal mt-3 font-bold uppercase tracking-widest">
                    {item.version}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-ppf-purple" /> {item.date}
                    </span>
                    <span className="opacity-30">|</span>
                    <span>{item.pages} Pages</span>
                  </div>

                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-ppf-teal hover:text-ppf-purple font-black text-sm transition-colors group/btn"
                  >
                    PDF <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-ppf-purple/20">
            <p className="text-lg text-slate-800 font-bold">
              No reports match your current selection.
            </p>
            <button
              onClick={() => { setYearFilter("All"); setTypeFilter("All"); }}
              className="mt-4 text-ppf-purple font-black underline underline-offset-4 hover:text-ppf-teal transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
