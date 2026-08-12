"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Briefcase, GraduationCap, Info,
  MapPin, Clock, ChevronRight
} from 'lucide-react';

// ── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ jobs = [], internships = [], onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null);

  const handleSelect = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
  };

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
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="shrink-0 z-10 bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between">
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

          <div className="overflow-y-auto flex-1">
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-8"
                >
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-ppf-purple transition-colors mb-6 group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to Opportunities
                  </button>
                  
                  <div className="max-w-3xl">
                    <p className="text-[10px] font-black uppercase text-ppf-purple tracking-wider mb-2">
                      {selectedItem.category || (itemType === 'job' ? "Research & Policy" : "General Research")}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-lora font-bold text-slate-900 leading-tight mb-4">
                      {selectedItem.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 font-semibold mb-6">
                      {selectedItem.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />{selectedItem.location}
                        </span>
                      )}
                      {selectedItem.duration && (
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />{selectedItem.duration}
                        </span>
                      )}
                      {selectedItem.stipend && (
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" />{selectedItem.stipend}
                        </span>
                      )}
                    </div>

                    
                    <div className="space-y-8">
                      {selectedItem.description && (
                        <div>
                          <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">Description</h3>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">{selectedItem.description}</p>
                        </div>
                      )}
                      {selectedItem.responsibilities && (
                        <div>
                          <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">Key Responsibilities</h3>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">{selectedItem.responsibilities}</p>
                        </div>
                      )}
                      {selectedItem.requirements && (
                        <div>
                          <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">Requirements</h3>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">{selectedItem.requirements}</p>
                        </div>
                      )}
                      {(!selectedItem.description && !selectedItem.responsibilities && !selectedItem.requirements) && (
                        <div>
                          <p className="text-slate-600 leading-relaxed text-[15px]">
                            We are looking for passionate individuals to join our team. Please apply below to express your interest and we will get back to you with more details regarding this role.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-slate-100">
                    {selectedItem.applyLink && (
                      <a
                        href={selectedItem.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-ppf-purple text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-ppf-purple/90 transition-all active:scale-95 shadow-lg shadow-ppf-purple/25"
                      >
                        Apply Now <Send className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8"
                >
                  {/* ── LEFT: Internship ── */}
                  <div className="rounded-2xl bg-slate-50 border border-ppf-purple/15 p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-ppf-purple/10 rounded-lg flex items-center justify-center text-ppf-purple">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Internship Programs</h3>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-medium mb-5">
                      Internships at PPF offer students and young professionals an opportunity to gain hands-on experience in public policy research, programme implementation, communications, and community outreach. 
                      Interns work closely with our team on real-world projects, developing practical skills while contributing to meaningful social impact.
                    </p>

                    {internships.length > 0 ? (
                      <div className="space-y-3 flex-1">
                        {internships.map((intern) => (
                          <div 
                            key={intern._id}
                            onClick={() => handleSelect(intern, 'internship')}
                            className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-ppf-purple/40 transition-all cursor-pointer group"
                          >
                            <div className="flex justify-between items-center gap-3">
                              <div className="space-y-1 flex-1">
                                <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-ppf-purple transition-colors">{intern.title}</h4>
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
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-ppf-purple text-slate-400 group-hover:text-white transition-colors shrink-0">
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-ppf-purple/5 border border-ppf-purple/20 rounded-xl p-4 flex items-start gap-3 flex-1">
                        <Info className="w-4 h-4 text-ppf-purple mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-ppf-purple text-sm font-black uppercase tracking-tight">No Active Cohorts Right Now</p>
                          <p className="text-slate-500 text-xs leading-normal mt-0.5 font-medium">
                            We regularly open internship cohorts. Check back soon or follow our channels for updates.
                          </p>
                          <a
                            href="https://mail.google.com/mail/?view=cm&to=ppfdareecha@gmail.com&su=Internship%20Application%20%E2%80%93%20PPF&body=Dear%20PPF%20Team%2C%0A%0AI%20am%20writing%20to%20express%20my%20interest%20in%20interning%20with%20Policy%20Perspectives%20Foundation.%0A%0AName%3A%0AQualification%3A%0AArea%20of%20Interest%3A%0A%0ARegards%2C"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 bg-ppf-purple text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-ppf-purple/80 transition-colors active:scale-95"
                          >
                            Apply <Send className="w-3 h-3" />
                          </a>
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
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-medium mb-5">
                      Explore full-time opportunities and strategic research roles at PPF to drive high-impact
                      national and regional policy frameworks.
                    </p>

                    {jobs.length > 0 ? (
                      <div className="space-y-3 flex-1">
                        {jobs.map((job) => (
                          <div 
                            key={job._id}
                            onClick={() => handleSelect(job, 'job')}
                            className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-ppf-teal/40 transition-all cursor-pointer group"
                          >
                            <div className="flex justify-between items-center gap-3">
                              <div className="space-y-1 flex-1">
                                <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-ppf-teal transition-colors">{job.title}</h4>
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
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-100 group-hover:bg-ppf-teal group-hover:border-ppf-teal text-slate-400 group-hover:text-white transition-colors shrink-0">
                                <ChevronRight className="w-4 h-4" />
                              </div>
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
                </motion.div>
              )}
            </AnimatePresence>
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
