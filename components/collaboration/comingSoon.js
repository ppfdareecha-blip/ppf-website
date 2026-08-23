"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Briefcase, GraduationCap, Info,
  MapPin, Clock, ChevronRight
} from 'lucide-react';

// ── Main ComingSoon Section ──────────────────────────────────────────────────
export default function ComingSoon({ jobs = [], internships = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null);

  const handleSelect = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
  };

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden" id="opportunities">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ppf-purple/5 blur-3xl opacity-60 rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-ppf-teal/5 blur-3xl opacity-40 rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
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
            className="text-3xl md:text-5xl font-lora font-bold text-slate-900 uppercase tracking-tight"
          >
            Opportunities at <span className="text-ppf-purple">PPF</span>
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto text-left">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12"
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
                    <a
                      href={selectedItem.applyLink || `https://mail.google.com/mail/?view=cm&to=admin@ppf.org.in&su=Application%20for%20${encodeURIComponent(selectedItem.title)}&body=Dear%20PPF%20Team%2C%0A%0AI%20am%20writing%20to%20express%20my%20interest%20in%20the%20${encodeURIComponent(selectedItem.title)}%20role.%0A%0AName%3A%0AQualification%3A%0AArea%20of%20Interest%3A%0A%0ARegards%2C`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-ppf-purple text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-ppf-purple/90 transition-all active:scale-95 shadow-lg shadow-ppf-purple/25"
                    >
                      Apply Now <Send className="w-4 h-4" />
                    </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* ── LEFT: Internship ── */}
                <div className="rounded-2xl bg-white shadow-xl border border-slate-100 p-8 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-ppf-purple/10 rounded-lg flex items-center justify-center text-ppf-purple">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Internship Programs</h3>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                    Internships at PPF offer students and young professionals an opportunity to gain hands-on experience in public policy research, programme implementation, communications, and community outreach. 
                    Interns work closely with our team on real-world projects, developing practical skills while contributing to meaningful social impact.
                  </p>

                  {internships.length > 0 ? (
                    <div className="space-y-4 flex-1">
                      {internships.map((intern) => (
                        <div 
                          key={intern._id}
                          onClick={() => handleSelect(intern, 'internship')}
                          className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-ppf-purple/40 transition-all cursor-pointer group"
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
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 group-hover:bg-ppf-purple group-hover:border-ppf-purple text-slate-400 group-hover:text-white transition-colors shrink-0">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-ppf-purple/5 border border-ppf-purple/20 rounded-xl p-5 flex items-start gap-4 flex-1">
                      <Info className="w-5 h-5 text-ppf-purple mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-ppf-purple text-sm font-black uppercase tracking-tight">We regularly open internship cohorts.</p>
                        <p className="text-slate-500 text-xs leading-normal mt-1 font-medium">
                          Please share your Resume and Cover letter over email.
                        </p>
                        <a
                          href="https://mail.google.com/mail/?view=cm&to=admin@ppf.org.in&su=Internship%20Application%20%E2%80%93%20PPF&body=Dear%20PPF%20Team%2C%0A%0AI%20am%20writing%20to%20express%20my%20interest%20in%20interning%20with%20Policy%20Perspectives%20Foundation.%0A%0AName%3A%0AQualification%3A%0AArea%20of%20Interest%3A%0A%0ARegards%2C"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-4 bg-ppf-purple text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-ppf-purple/90 transition-colors active:scale-95 shadow-md"
                        >
                          Apply <Send className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── RIGHT: Job Vacancies ── */}
                <div className="rounded-2xl bg-white shadow-xl border border-slate-100 p-8 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-ppf-teal/10 rounded-lg flex items-center justify-center text-ppf-teal">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Job Vacancies</h3>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                    Explore full-time opportunities and strategic research roles at PPF to drive high-impact
                    national and regional policy frameworks.
                  </p>

                  {jobs.length > 0 ? (
                    <div className="space-y-4 flex-1">
                      {jobs.map((job) => (
                        <div 
                          key={job._id}
                          onClick={() => handleSelect(job, 'job')}
                          className="bg-slate-50 border border-slate-200/50 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-ppf-teal/40 transition-all cursor-pointer group"
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
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 group-hover:bg-ppf-teal group-hover:border-ppf-teal text-slate-400 group-hover:text-white transition-colors shrink-0">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* No vacancies state */
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4">
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
      </div>
    </section>
  );
}
