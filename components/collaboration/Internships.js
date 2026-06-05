"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Send, Briefcase, GraduationCap, Info, ArrowRight, MapPin, Calendar, Clock } from 'lucide-react';

export default function CareerSection({ jobs = [], internships = [] }) {
  return (
    /* Light theme background */
    <section id="careers" className="py-12 bg-white">
      <div className="container mx-auto px-6">

        {/* Header - Using ppf-purple for brand identity */}
        <div className="mb-8 border-b border-slate-100 pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
              Careers &amp; Internships
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">Join the PPF mission-driven team</p>
          </div>
          <div className="h-1.5 w-12 bg-ppf-purple rounded-full mb-1"></div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">

          {/* 1. INTERNSHIP SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl bg-slate-50 border border-ppf-purple/10 p-6 flex flex-col justify-between hover:border-ppf-purple/30 transition-all duration-300 shadow-sm"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-ppf-purple/10 rounded-lg flex items-center justify-center text-ppf-purple">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Internship Programs</h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Launch your career in public policy. Gain hands-on experience in research and implementation. Open for students and recent graduates looking for strategic impact.
              </p>

              {internships.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {internships.map((intern) => (
                    <div key={intern._id} className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{intern.title}</h4>
                          <p className="text-[10px] font-black uppercase text-ppf-purple tracking-wider">
                            {intern.category || "General Research"}
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1.5 text-[11px] text-slate-500 font-semibold">
                            {intern.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {intern.location}
                              </span>
                            )}
                            {intern.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {intern.duration}
                              </span>
                            )}
                            {intern.stipend && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                {intern.stipend}
                              </span>
                            )}
                          </div>
                        </div>
                        {intern.applyLink && (
                          <a
                            href={intern.applyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-ppf-purple transition-colors shrink-0 active:scale-95"
                          >
                            Apply <Send className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-ppf-purple/5 border border-ppf-purple/20 rounded-xl p-4 flex items-start gap-3 mt-4">
                  <Info className="w-4 h-4 text-ppf-purple mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ppf-purple text-sm font-black uppercase tracking-tight">No active internship cohorts</p>
                    <p className="text-slate-500 text-xs leading-normal mt-0.5 font-medium">
                      Check back later or follow our social channels for updates on future cohort applications.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-ppf-purple/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-ppf-purple flex items-center justify-center text-[7px] font-black text-white uppercase tracking-tighter shadow-sm">PPF</div>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                {internships.length} Available Roles
              </span>
            </div>
          </motion.div>

          {/* 2. JOB OPENINGS SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 p-6 flex flex-col justify-between bg-white hover:border-ppf-teal/30 transition-all duration-300 shadow-sm"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-ppf-teal/10 rounded-lg flex items-center justify-center text-ppf-teal">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Job Openings</h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Explore full-time opportunities and strategic research roles at PPF to drive high-impact national and regional policy frameworks.
              </p>

              {jobs.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {jobs.map((job) => (
                    <div key={job._id} className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{job.title}</h4>
                          <p className="text-[10px] font-black uppercase text-ppf-teal tracking-wider">
                            {job.category || "Research & Policy"}
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1.5 text-[11px] text-slate-500 font-semibold">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {job.location}
                              </span>
                            )}
                            {job.stipend && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                {job.stipend}
                              </span>
                            )}
                          </div>
                        </div>
                        {job.applyLink && (
                          <a
                            href={job.applyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-ppf-teal transition-colors shrink-0 active:scale-95"
                          >
                            Apply <Send className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-ppf-orange/5 border border-ppf-orange/20 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-ppf-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ppf-orange text-sm font-black uppercase tracking-tight">No current openings</p>
                    <p className="text-slate-500 text-xs leading-normal mt-0.5 font-medium">
                      Check back later or follow our social channels for updates on senior research and leadership roles.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                {jobs.length} Active Positions
              </span>
              <button className="text-xs font-black text-slate-500 flex items-center gap-1 hover:text-ppf-teal transition-colors uppercase tracking-widest">
                Stay Tuned <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}