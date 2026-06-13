"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function WorkWithUsSection() {
  const fadeInRight = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } }
  };

  return (
    <section className="relative py-16 overflow-hidden bg-white">

      {/* subtle brand bg accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-ppf-purple/5 rounded-full blur-3xl opacity-40 -mr-36 -mt-20" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-ppf-teal/5 rounded-full blur-3xl opacity-50 -ml-28 -mb-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* Image */}
          <motion.div
            className="w-full lg:w-[55%] relative group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg border border-slate-100">
              <img
                src="/partners.jpeg"
                alt="Collaborative meeting"
                className="w-full h-[320px] object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ppf-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
            </div>

            {/* compact badge - Using ppf-teal for success/partnerships */}
            <div className="absolute -bottom-4 -right-4 hidden md:flex bg-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-50 items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-ppf-teal" />
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">50+ Partners</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="w-full lg:w-[45%]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
          >

            <div className="h-1.5 w-12 bg-ppf-orange rounded-full mb-6"></div>

            <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">
              We turn collective intelligence into evidence-based policy solutions with <span className="text-ppf-purple font-bold">governments</span>, <span className="text-ppf-teal font-bold">NGOs</span>, and enterprises across the globe.
            </p>

            {/* list - Using ppf-teal for checkmarks */}
            <ul className="space-y-4 mb-8">
              {[
                "Research Partnerships",
                "Policy Consulting",
                "Impact Programs"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700 group/item">
                  <CheckCircle2 className="w-5 h-5 text-ppf-teal transition-transform group-hover/item:scale-110" />
                  <span className="text-sm font-black uppercase tracking-wide text-slate-800">{item}</span>
                </li>
              ))}
            </ul>

            {/* button - Primary brand button */}
            <button className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-ppf-purple hover:shadow-lg hover:shadow-ppf-purple/20 active:scale-95">
              Start Conversation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}