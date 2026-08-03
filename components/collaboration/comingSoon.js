"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Briefcase, GraduationCap, Info,
  MapPin, Clock, ChevronRight
} from 'lucide-react';

// ── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ jobs = [], internships = [], onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ppf-purple mb-0.5">Policy Perspectives Foundation</p>
              <h2 className="text-2xl font-lora font-bold text-slate-900 uppercase tracking-tight">Opportunities at PPF</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-ppf-purple hover:text-white text-slate-500 transition-all active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">

            {/* ── LEFT: Internship ── */}
            <div className="rounded-2xl bg-slate-50 border border-ppf-purple/15 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-ppf-purple/10 rounded-lg flex items-center justify-center text-ppf-purple">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Internship Programs</h3>
                  <p className="text-[10px] font-bold text-ppf-purple uppercase tracking-wider">
                    {internships.length} Available
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-medium mb-5">
                Internships at PPF offer students and young professionals an opportunity to gain hands-on experience in public policy research, programme implementation, communications, and community outreach. 
                Interns work closely with our team on real-world projects, developing practical skills while contributing to meaningful social impact.
              </p>

              {internships.length > 0 ? (
                <div className="space-y-3 flex-1">
                  {internships.map((intern) => (
                    <div key={intern._id} className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{intern.title}</h4>
                          <p className="text-[10px] font-black uppercase text-ppf-purple tracking-wider">
                            {intern.category || "General Research"}
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-500 font-semibold">
                            {intern.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />{intern.location}
                              </span>
                            )}
                            {intern.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />{intern.duration}
                              </span>
                            )}
                            {intern.stipend && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-slate-400" />{intern.stipend}
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
                <div className="bg-ppf-purple/5 border border-ppf-purple/20 rounded-xl p-4 flex items-start gap-3 flex-1">
                  <Info className="w-4 h-4 text-ppf-purple mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ppf-purple text-sm font-black uppercase tracking-tight">No Active Cohorts Right Now</p>
                    <p className="text-slate-500 text-xs leading-normal mt-0.5 font-medium">
                      We regularly open internship cohorts. Check back soon or follow our channels for updates.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Job Vacancies ── */}
            <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-ppf-teal/10 rounded-lg flex items-center justify-center text-ppf-teal">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Job Vacancies</h3>
                  <p className="text-[10px] font-bold text-ppf-teal uppercase tracking-wider">
                    {jobs.length} Active Position{jobs.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-medium mb-5">
                Explore full-time opportunities and strategic research roles at PPF to drive high-impact
                national and regional policy frameworks.
              </p>

              {jobs.length > 0 ? (
                <div className="space-y-3 flex-1">
                  {jobs.map((job) => (
                    <div key={job._id} className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{job.title}</h4>
                          <p className="text-[10px] font-black uppercase text-ppf-teal tracking-wider">
                            {job.category || "Research & Policy"}
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-500 font-semibold">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />{job.location}
                              </span>
                            )}
                            {job.stipend && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-slate-400" />{job.stipend}
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
                /* No vacancies state */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Briefcase className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-slate-800 font-black text-base uppercase tracking-tight mb-2">
                    Currently No Vacancy
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    We are committed to building a team of dedicated professionals who are passionate about creating meaningful social impact through research and action. 
                    At present, we do not have any job openings. However, we welcome expressions of interest and encourage you to visit this page periodically for future opportunities
                  </p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main ComingSoon Section ──────────────────────────────────────────────────
export default function ComingSoon({ jobs = [], internships = [] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ppf-purple/5 blur-3xl opacity-60 rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-ppf-teal/5 blur-3xl opacity-40 rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs md:text-lg font-black uppercase tracking-[0.25em] text-ppf-purple mb-4"
            >
              Join Our Team
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl font-lora font-bold text-slate-900 uppercase tracking-tight mb-8"
            >
              Opportunities at <span className="text-ppf-purple">PPF</span>
            </motion.h2>

            {/* PPF Belief Content - Styled like a premium editorial quote block */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm mb-10 max-w-3xl mx-auto"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-r from-ppf-purple to-ppf-teal rounded-full" />
              
              <p className="text-slate-800 text-lg md:text-xl leading-relaxed font-medium">
                At PPF, we believe in nurturing <span className="text-ppf-purple font-bold">curious minds</span> and <span className="text-ppf-purple font-bold">purpose-driven professionals</span>. We provide opportunities to engage with critical public policy and development challenges, collaborate with leading experts and institutions, and create meaningful impact through research, outreach, and implementation. Whether in research, programme management, communications, or field coordination, every role contributes to shaping evidence-based solutions for a better tomorrow.
              </p>
            </motion.div>

            {/* Apply Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 bg-ppf-purple text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-ppf-purple/90 hover:shadow-xl hover:shadow-ppf-purple/25 active:scale-95 transition-all"
              >
                Apply <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {modalOpen && (
        <ApplyModal
          jobs={jobs}
          internships={internships}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
