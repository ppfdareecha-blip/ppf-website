"use client";

import React from "react";
import Image from "next/image";
import {
  Download,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
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
      <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

export default function ProjectReport({ projectData = [] }) {
  const displayData = projectData || [];

  if (!displayData.length) return null;

  // SINGLE PROJECT VIEW
  if (displayData.length === 1) {
    const item = displayData[0];

    return (
      <section
        id="projects"
        className="w-full py-16 px-6 bg-white border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            icon={Briefcase}
            title="Project Reports"
            subtitle="In-depth documentation of our ongoing and completed research initiatives across various policy domains."
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex flex-col lg:flex-row">
              {/* IMAGE */}
              {item.img && (
                <div className="relative lg:w-[40%] w-full h-64 lg:h-auto min-h-[320px]">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 40vw"
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="flex-1 p-6 lg:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      item.status === "Completed"
                        ? "bg-ppf-teal/10 text-ppf-teal border border-ppf-teal/20"
                        : "bg-ppf-orange/10 text-ppf-orange border border-ppf-orange/20"
                    }`}
                  >
                    {item.status === "Completed" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {item.status}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
                    <Calendar size={14} />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>

                {item.source && (
                  <p className="text-sm font-semibold text-slate-500 mb-4">
                    {item.source}
                  </p>
                )}

                {item.description && (
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-end gap-4 pt-5 border-t border-slate-100">                  {(item.file || item.link) && (
                    <a
                      href={item.file || item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-900 hover:bg-ppf-purple text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      ACCESS REPORT
                      <Download size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // MULTIPLE PROJECTS VIEW
  return (
    <section
      id="projects"
      className="w-full py-12 px-6 bg-white border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={Briefcase}
          title="Project Reports"
          subtitle="In-depth documentation of our ongoing and completed research initiatives across various policy domains."
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayData.map((item, i) => (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden flex flex-col bg-white border border-slate-200 rounded-2xl hover:border-ppf-purple hover:shadow-lg transition-all"
            >
              {item.img && (
                <div className="relative w-full h-48">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                      item.status === "Completed"
                        ? "bg-ppf-teal/10 text-ppf-teal"
                        : "bg-ppf-orange/10 text-ppf-orange"
                    }`}
                  >
                    {item.status === "Completed" ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    {item.status}
                  </span>

                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                {item.source && (
                  <p className="text-xs text-slate-500 mb-3">
                    {item.source}
                  </p>
                )}

                {item.description && (
                  <p className="text-sm text-slate-600 line-clamp-3 flex-grow">
                    {item.description}
                  </p>
                )}

                <div className="flex justify-end items-center mt-5 pt-4 border-t border-slate-100">                  {(item.file || item.link) && (
                    <a
                      href={item.file || item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-ppf-purple transition-all"
                    >
                      REPORT
                      <Download size={12} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}