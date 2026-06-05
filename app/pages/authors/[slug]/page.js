"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaUser, FaChevronLeft, FaLinkedin, FaTwitter, FaFacebook, FaRegCalendarAlt, FaEnvelope } from "react-icons/fa";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

// hehe

export default function AuthorDetail() {
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsNavHidden(true);
    } else {
      setIsNavHidden(false);
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    fetch(`/api/authors/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setAuthor(json.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching author details:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-ppf-purple rounded-full animate-spin" />
        <span className="font-lato text-xs font-bold uppercase tracking-[0.2em] text-slate-500 animate-pulse text-center">
          Loading Author Profile...
        </span>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <Navbar />
        <div className="text-center space-y-4 max-w-md pt-20">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border-2 border-red-200 shadow-lg">
            <FaUser size={30} />
          </div>
          <h2 className="text-2xl font-lora font-black text-slate-900">Author Not Found</h2>
          <p className="text-slate-500 text-sm font-medium font-lato leading-relaxed">
            The profile you are trying to access doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/pages/opinions"
            className="inline-flex items-center gap-2 bg-ppf-purple text-white px-6 py-3 rounded-xl text-xs font-lato font-black uppercase tracking-widest hover:bg-ppf-orange transition-all duration-200 shadow-md"
          >
            <FaChevronLeft size={10} /> Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-slate-800 font-lato selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden antialiased">
      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={isNavHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100] shadow-sm"
      >
        <Navbar />
      </motion.div>

      <main className="pt-28 md:pt-36 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Action Header / Breadcrumb */}
          <div className="mb-10">
            <Link
              href="/pages/opinions"
              className="group inline-flex items-center gap-3 text-xs font-lato font-bold text-ppf-purple uppercase tracking-widest hover:text-ppf-orange transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-ppf-purple group-hover:border-ppf-purple group-hover:text-white transition-all duration-200 shadow-sm">
                <FaChevronLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Library
            </Link>
          </div>

          {/* Author Biography Card */}
          <div className="bg-slate-50/60 border border-slate-100 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm mb-16 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-ppf-purple/5 blur-2xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-ppf-teal/5 blur-3xl rounded-full" />

            {/* Author Profile Picture */}
            <div className="relative flex-shrink-0">
              {author.image ? (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-purple-500 to-ppf-purple flex items-center justify-center text-white shadow-xl border-4 border-white">
                  <FaUser size={48} />
                </div>
              )}
            </div>

            {/* Author Meta Details & Biography */}
            <div className="flex-1 text-center md:text-left space-y-4 min-w-0">
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-lora font-black text-slate-900 tracking-tight">
                  {author.name}
                </h1>
                <p className="text-sm font-extrabold text-teal-600 uppercase tracking-widest">
                  {author.position}
                </p>
              </div>

              {author.about ? (
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-normal">
                  {author.about}
                </p>
              ) : (
                <p className="text-slate-400 italic text-sm">
                  Biography description is not available.
                </p>
              )}

              {/* Social Channels Links */}
              {author.socialLinks && author.socialLinks.length > 0 && (
                <div className="flex justify-center md:justify-start gap-3 pt-2">
                  {author.socialLinks.map((link, i) => {
                    let Icon = FaEnvelope;
                    if (link.includes("linkedin.com")) Icon = FaLinkedin;
                    else if (link.includes("twitter.com") || link.includes("x.com")) Icon = FaTwitter;
                    else if (link.includes("facebook.com")) Icon = FaFacebook;

                    return (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-500 hover:bg-ppf-purple hover:text-white hover:scale-105 transition-all shadow-sm border border-slate-100/60"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Opinions Grid written by this Author */}
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-lora font-black uppercase tracking-tight text-slate-900">
                Insights &amp; Publications By {author.name}
              </h2>
            </div>

            {author.opinions && author.opinions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {author.opinions.map((op) => (
                  <Link
                    key={op._id || op.id}
                    href={`/pages/opinions/${op.id || op._id}`}
                    className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden h-full"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={op.image}
                        alt={op.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-ppf-orange bg-white/95 backdrop-blur-md text-[8px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                        {op.category}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-grow space-y-3">
                      <h4 className="text-base font-lora font-bold text-slate-900 group-hover:text-ppf-purple transition-colors duration-200 line-clamp-2 leading-snug">
                        {op.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                        {op.description ? op.description.replace(/<[^>]*>/g, "") : ""}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider pt-2 border-t border-slate-50 mt-auto">
                        <FaRegCalendarAlt size={10} className="text-ppf-orange shrink-0" />
                        <span>{op.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-10 text-center text-slate-400 font-bold italic">
                No published opinions or articles found for this author.
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
