"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Sparkles } from 'lucide-react';

export default function ComingSoon() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Brand Accent Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-ppf-purple/5 blur-3xl opacity-60 rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Pulsing Icon Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ppf-purple/10 text-ppf-purple mb-6 relative"
          >
            <Calendar className="w-8 h-8" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 bg-ppf-orange text-white p-1 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-lora font-bold text-slate-900 uppercase tracking-tighter mb-4"
          >
            Opportunities <span className="text-ppf-purple">Coming Soon</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-slate-600 text-base leading-relaxed font-medium mb-8 max-w-lg mx-auto"
          >
            We are designing new courses, internships, and research roles. Check back soon or register your interest to be notified when they launch.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => {
                const footer = document.querySelector('footer');
                if (footer) {
                  footer.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-ppf-purple hover:shadow-lg hover:shadow-ppf-purple/20 active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Get In Touch
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
