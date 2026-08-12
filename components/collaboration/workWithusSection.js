"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Award, Users, BookOpen, Share2 } from 'lucide-react';

export default function WorkWithUsSection() {
  const fadeInRight = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } }
  };

  const partnershipAreas = [
    {
      title: "Collaborative Research",
      desc: "Joint studies, policy papers, commissioned research, and knowledge partnerships.",
      icon: BookOpen
    },
    {
      title: "Dialogue & Convenings",
      desc: "Conferences, roundtables, seminars, workshops, lecture series, and policy consultations.",
      icon: Users
    },
    {
      title: "Community Outreach & Capacity Building",
      desc: "Awareness programmes, field interventions, training and CSR oriented community engagement Initiatives.",
      icon: Award
    },
    {
      title: "Knowledge Exchange",
      desc: "Academic collaborations, and publication partnerships.",
      icon: Share2
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-slate-50/50">

      {/* subtle brand bg accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ppf-purple/5 rounded-full blur-3xl opacity-40 -mr-48 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-ppf-teal/5 rounded-full blur-3xl opacity-50 -ml-40 -mb-10 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">

          {/* Image */}
          <motion.div
            className="w-full lg:w-[50%] relative group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-xl border border-slate-100 bg-white p-2">
              <img
                src="/partners.jpeg"
                alt="Collaborative meeting"
                className="w-full h-[400px] object-cover rounded-2xl transition duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ppf-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl" />
            </div>

            {/* compact badge - Using ppf-teal for success/partnerships */}
            <div className="absolute -bottom-4 -right-4 hidden md:flex bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-ppf-teal" />
              <p className="text-xs font-black uppercase tracking-widest">50+ Partners</p>
            </div>
          </motion.div>

          {/* Content - Top Section */}
          <motion.div
            className="w-full lg:w-[50%] space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
          >
            <div className="h-1.5 w-16 bg-ppf-orange rounded-full mb-6"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold font-lora text-slate-950 leading-tight">
              Fostering Impactful Partnerships
            </h2>

            <div className="space-y-5 text-slate-700 text-base md:text-[17px] leading-relaxed">
              <p>
                At Policy Perspectives Foundation (PPF), we believe that meaningful policy solutions emerge through collaboration. We work with government institutions, academic organisations, research centres, civil society organisations, corporate partners, multilateral institutions, and independent experts to generate evidence-based research, facilitate informed dialogue, and translate ideas into meaningful community action.
              </p>

              <p>
                For over two decades, PPF has contributed to India&apos;s public policy landscape through rigorous research, high-level dialogues, capacity-building initiatives, and community outreach programmes. Our work spans a wide range of sectors and is strengthened by partnerships that bring together diverse perspectives and expertise.
              </p>

              <p className="text-slate-600 border-l-4 border-ppf-purple pl-4 italic">
                With 500+ research publications and over 70 editions of Dialogue, our flagship journal published in collaboration with Aastha Bharti for more than 25 years, PPF has built a strong platform for policy discourse, knowledge creation, and collaborative engagement.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Partnership Areas & Closing - Below Image */}
        <motion.div
          className="w-full space-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInLeft}
        >
          {/* Partnership Areas Grid */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black uppercase tracking-widest text-ppf-purple mb-8 text-center md:text-left">
              Areas of Partnership
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnershipAreas.map((area, idx) => {
                const Icon = area.icon;
                return (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-ppf-purple/10 text-ppf-purple flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{area.title}</h4>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">{area.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Closing Section */}
          <div id="partner" className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-ppf-purple/5 to-ppf-teal/5 rounded-3xl p-8 md:p-12 border border-ppf-purple/10">
            <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed">
              Whether you are an organisation seeking a knowledge partner, a researcher exploring collaborative opportunities, or an institution looking to create evidence-based impact, PPF offers a credible platform backed by multidisciplinary expertise, institutional experience, and a strong commitment to public policy and social development.
            </p>

            <p className="text-slate-800 text-base md:text-lg font-bold">
              We invite you to partner with us in shaping informed policy, strengthening institutions, and creating meaningful impact.
            </p>

            <div className="pt-2">
              <a 
                href="https://mail.google.com/mail/?view=cm&to=ppf.dareecha@gmail.com.in&su=Partnership%20Inquiry%20-%20Policy%20Perspectives%20Foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:bg-ppf-purple hover:shadow-lg hover:shadow-ppf-purple/20 active:scale-95"
              >
                Partner with us
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
