"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUserAlt } from "react-icons/fa";

export default function TeamModal({ isOpen, onClose, member }) {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/10 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="relative w-full max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[60] bg-white/90 hover:bg-white text-slate-900 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg border border-slate-100"
            >
              <FaTimes size={16} />
            </button>

            {/* Sidebar Image Area */}
            <div className="relative w-full md:w-[40%] h-72 sm:h-96 md:h-auto bg-[#F8FAFC] flex-shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-70"></div>

              <div className="absolute bottom-8 left-8 right-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block px-3 py-1 bg-ppf-purple text-white text-[9px] font-lora font-black uppercase tracking-[0.2em] rounded-sm mb-4">
                    {member.designation}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-lora font-black text-white tracking-tight leading-none">{member.name}</h2>
                </motion.div>
              </div>
            </div>

            {/* Content Area with visible custom scrollbar */}
            <div className="flex-grow p-6 sm:p-12 lg:p-16 overflow-y-auto bg-white custom-modal-scrollbar">
              <div className="max-w-2xl mx-auto md:mx-0">
                <div className="mb-12">
                   <h4 className="text-[10px] font-lora font-black text-ppf-purple uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <FaUserAlt size={10} /> Profile
                  </h4>
                  <p className="text-xl sm:text-2xl font-lato font-black text-slate-900 leading-tight mb-8">
                    {member.about}
                  </p>
                  <div className="h-1 w-20 bg-ppf-purple rounded-full"></div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-[10px] font-lora font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-3">Detailed Biography</h4>
                    <div className="text-slate-600 font-lato text-sm sm:text-base leading-relaxed space-y-6 font-medium">
                      {member.bio.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-lato font-black text-slate-400 uppercase tracking-widest mb-3">Professional Email</p>
                      {member.email ? (
                        <p className="text-sm font-lato font-bold text-slate-900 break-all">{member.email}</p>
                      ) : (
                        <p className="text-sm font-lato font-bold text-slate-300 italic">Not available</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-lato font-black text-slate-400 uppercase tracking-widest mb-3">Direct Phone</p>
                      {member.phone ? (
                        <p className="text-sm font-lato font-bold text-slate-900">{member.phone}</p>
                      ) : (
                        <p className="text-sm font-lato font-bold text-slate-300 italic">Office contact only</p>
                      )}
                    </div>
                    {member.subjectsOfInterest && (
                      <div className="sm:col-span-2">
                        <p className="text-[9px] font-lato font-black text-slate-400 uppercase tracking-widest mb-3">Subjects of Interest</p>
                        <p className="text-sm font-lato font-bold text-slate-900">{member.subjectsOfInterest}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}