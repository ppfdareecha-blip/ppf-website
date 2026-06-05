"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaTimes, FaArrowRight } from "react-icons/fa";

export default function EventModal({ isOpen, onClose, event }) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-[#001D4A]/20 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-ppf-purple transition-colors border border-slate-100"
            >
              <FaTimes />
            </button>

            <div className="flex flex-col">
              {/* Image Area (Smaller) */}
              <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                <div className="absolute bottom-4 left-8 flex flex-wrap gap-2">
                   <span className="bg-ppf-purple text-white text-[10px] font-lora font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                      {event.type || "Event"}
                   </span>
                   {event.centerTag && (
                     <span className="bg-ppf-orange text-ppf-purple text-[10px] font-lora font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                        {event.centerTag}
                     </span>
                   )}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-10 md:p-12 -mt-6 relative bg-white rounded-t-[2rem]">
                <h2 className="text-xl md:text-2xl font-lora font-black text-ppf-purple leading-[1.25] mb-6 line-clamp-2">
                  {event.title}
                </h2>

                <p className="text-slate-600 font-lato text-base leading-relaxed mb-10 line-clamp-3 italic font-medium border-l-4 border-ppf-orange/30 pl-6">
                  {event.summary || event.about}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {event.pdfLink && (
                    <a
                      href={event.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex-1 flex items-center justify-center gap-3 bg-white text-ppf-purple border-2 border-ppf-purple hover:bg-ppf-purple/5 font-lato font-black text-sm tracking-widest uppercase py-4 px-8 rounded-2xl transition-all shadow-md group"
                    >
                      Download PDF
                    </a>
                  )}
                  <Link
                    href={`/pages/activities/${event.id}`}
                    onClick={onClose}
                    className="w-full flex-1 flex items-center justify-center gap-3 bg-ppf-purple hover:bg-ppf-purple/90 text-white font-lato font-black text-sm tracking-widest uppercase py-4 px-8 rounded-2xl transition-all shadow-xl shadow-ppf-purple/20 group"
                  >
                    Read Full Report <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
