"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Zap, Globe, CheckCircle2 } from 'lucide-react';

export default function DonateSection() {
  const [selectedAmount, setSelectedAmount] = useState('$50');

  const impactMetrics = [
    { icon: <Zap className="w-5 h-5" />, label: "Rapid Research", desc: "Funding urgent policy briefs" },
    { icon: <Globe className="w-5 h-5" />, label: "Public Access", desc: "Keeping our data open-source" },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Independence", desc: "Zero corporate influence" },
  ];

  return (
    <section id="donate" className="relative py-24 bg-white overflow-hidden">
      {/* Background Decorative Elements using Brand Palette */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-ppf-purple/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-ppf-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Side: Context & Trust */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ppf-orange/10 border border-ppf-orange/20 text-ppf-orange text-xs font-black uppercase tracking-widest mb-6">
                <Heart size={12} fill="currentColor" /> Support our mission
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase">
                Your Support Fuels <span className="text-ppf-purple">Better Policy.</span>
              </h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                Policy Perspective Foundation is a non-profit initiative. We rely on people like you to maintain our editorial independence and produce high-impact research.
              </p>

              <div className="space-y-6">
                {impactMetrics.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-ppf-teal shadow-sm group-hover:bg-ppf-teal group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.label}</h4>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Donation Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Vibrant Accent Glow behind card */}
              <div className="absolute inset-0 bg-ppf-purple rounded-[2.5rem] translate-x-4 translate-y-4 opacity-10 blur-xl" />

              <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Select Amount</h3>
                <p className="text-slate-500 mb-8 text-sm font-bold uppercase tracking-wide">One-time contribution</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {['$25', '$50', '$100', 'Custom'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`py-5 rounded-2xl font-black transition-all border-2 text-sm uppercase tracking-widest ${selectedAmount === amt
                          ? 'border-ppf-purple bg-ppf-purple/5 text-ppf-purple shadow-lg shadow-ppf-purple/10'
                          : 'border-slate-50 hover:border-ppf-purple/20 text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                <button className="w-full group relative flex items-center justify-center gap-3 bg-slate-900 text-white py-6 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:bg-ppf-purple transition-all duration-500 hover:-translate-y-1">
                  Donate Now
                  <CheckCircle2 className="w-5 h-5 text-ppf-teal group-hover:text-white transition-colors" />
                </button>

                <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-ppf-purple flex items-center justify-center text-[8px] font-black text-white uppercase">
                          PPF
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Join 2,400+<br />Supporters
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <p className="text-[10px] text-ppf-teal font-black tracking-widest uppercase flex items-center gap-2">
                      <ShieldCheck size={14} /> 80G Certified
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}