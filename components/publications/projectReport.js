"use client";

import React from "react";
import { FileText, Download, Calendar, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  // Updated with brand color: ppf-purple
  <div className="mb-10 border-l-4 border-ppf-purple pl-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-ppf-purple/10 p-2 rounded-lg">
        <Icon className="text-ppf-purple w-6 h-6" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
        {title}
      </h2>
    </div>
    {subtitle && (
      <p className="text-base text-slate-600 max-w-2xl leading-relaxed">{subtitle}</p>
    )}
  </div>
);

export default function ProjectReport({ projectData = [] }) {
  // Enhanced internal data if props are minimal
  const displayData = projectData.length > 0 ? projectData : [
    {
      title: "Water Resource Management in the Himalayas",
      source: "Himalayan Basin Project",
      date: "March 2026",
      link: "#",
      status: "Completed"
    },
    {
      title: "Urban Sustainability & Smart City Implementation",
      source: "Urban Future Initiative",
      date: "Nov 2025",
      link: "#",
      status: "Ongoing"
    },
    {
      title: "Maritime Security & Port Resilience Analysis",
      source: "Indo-Pacific Blue Project",
      date: "Feb 2026",
      link: "#",
      status: "Completed"
    },
    {
      title: "AI Ethics in Public Policy Frameworks",
      source: "Digital Governance Lab",
      date: "Jan 2026",
      link: "#",
      status: "Ongoing"
    }
  ];

  return (
    <section id="projects" className="w-full py-12 px-6 bg-white">
      <SectionHeader
        icon={Briefcase}
        title="Project Reports"
        subtitle="In-depth documentation of our ongoing and completed research initiatives across various policy domains."
      />

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {displayData.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex flex-col p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-ppf-purple hover:shadow-xl transition-all duration-300"
          >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === "Completed"
                  ? "bg-ppf-teal/10 text-ppf-teal border border-ppf-teal/20"
                  : "bg-ppf-orange/10 text-ppf-orange border border-ppf-orange/20"
                }`}>
                {item.status === "Completed" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {item.status}
              </span>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={12} /> {item.date}
              </span>
            </div>

            {/* Title & Source */}
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-ppf-purple leading-tight transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-ppf-purple/30" />
                {item.source}
              </p>
            </div>

            {/* CTA / Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-xs font-bold text-slate-400">Reference: PRJ-{2025 + i}</span>

              <a
                href={item.link}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg font-black text-xs hover:bg-ppf-purple transition-all shadow-md active:scale-95"
              >
                ACCESS REPORT <Download size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}