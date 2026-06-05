"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaShieldAlt, FaHeart, FaChevronRight } from "react-icons/fa";

export default function SupportQueries({ sectionWidth }) {
  const itemAnimate = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <section id="queries" className={`relative py-12 px-6 bg-white ${sectionWidth}`}>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        
        {/* LEFT COLUMN: Compact Form */}
        <motion.div 
          {...itemAnimate}
          className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-lg shadow-ppf-purple/5"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-lora font-bold text-slate-900 leading-tight">Have a Question ?</h3>
            <p className="text-sm text-slate-500 font-lato font-medium">Our team will get back to you shortly.</p>
          </div>

          <form className="space-y-3">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-ppf-purple focus:ring-2 focus:ring-ppf-purple/5 transition-all text-sm font-lato font-medium text-slate-700"
            />

            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-ppf-purple focus:ring-2 focus:ring-ppf-purple/5 transition-all text-sm font-lato font-medium text-slate-700"
            />

            <div className="relative">
              <select className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-ppf-purple appearance-none text-sm font-lato font-medium text-slate-500">
                <option>Select Query Type</option>
                <option>General Inquiry</option>
                <option>Research Collaboration</option>
                <option>Media Query</option>
                <option>Others</option>
              </select>
              <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[10px] text-slate-400 pointer-events-none" />
            </div>

            <div className="py-1">
              <p className="text-xs text-slate-600 font-lato font-black mb-2">Are you a citizen?</p>
              <div className="flex flex-wrap gap-4">
                <label htmlFor="citizen-india" className="flex items-center gap-2 text-xs text-slate-600 font-lato font-bold cursor-pointer">
                  <input
                    type="radio"
                    id="citizen-india"
                    name="citizenship"
                    value="india"
                    className="w-4 h-4 accent-ppf-purple cursor-pointer"
                  />
                  India
                </label>
                <label htmlFor="citizen-foreign" className="flex items-center gap-2 text-xs text-slate-600 font-lato font-bold cursor-pointer">
                  <input
                    type="radio"
                    id="citizen-foreign"
                    name="citizenship"
                    value="foreign"
                    className="w-4 h-4 accent-ppf-purple cursor-pointer"
                  />
                  Foreign Country
                </label>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-ppf-purple text-white font-lato font-black uppercase tracking-widest text-xs py-4 rounded-lg shadow-md hover:bg-ppf-purple/90 transition-all flex items-center justify-center gap-2"
            >
              PROCEED TO CONNECT
              <FaPaperPlane className="text-[10px]" />
            </motion.button>
          </form>

          <div className="mt-4 flex items-center gap-2 text-[9px] font-lato font-bold text-slate-400 uppercase tracking-wider justify-center">
            <FaShieldAlt className="text-ppf-teal" /> Encrypted Data Handling
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Impact Text */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:pl-4"
        >
          <h2 className="text-3xl md:text-4xl font-lora font-black text-slate-900 mb-4 leading-tight">
            CONNECT
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-ppf-orange/20 rounded-full flex items-center justify-center text-ppf-purple text-sm">
                <FaPaperPlane />
              </div>
              <p className="text-sm font-lato font-bold md:text-base text-slate-600 leading-relaxed">
                We are here to answer your questions. Drop us a message and we will get back to you shortly.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-ppf-purple rounded-full flex items-center justify-center text-white text-sm">
                <FaHeart />
              </div>
              <p className="text-sm md:text-base font-lato font-bold text-slate-600 leading-relaxed">
                Our work relies on the support of individuals and foundations. We invite you to support our vision.
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 border-l-2 border-ppf-purple bg-slate-50 rounded-r-xl">
            <p className="text-slate-800 font-lato font-bold text-sm md:text-base italic leading-snug">
              &quot; Help us navigate the world towards a better place. &quot;
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
