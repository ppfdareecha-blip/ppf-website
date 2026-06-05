"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaFilePdf, FaCalendar, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { motion } from "framer-motion";

const NEWSLETTERS_PER_PAGE = 6;

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const res = await fetch("/api/newsletters");
        const data = await res.json();
        if (data.success) {
          // Sort by date descending
          const sorted = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setNewsletters(sorted);
        }
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNewsletters();
  }, []);

  const totalPages = Math.ceil(newsletters.length / NEWSLETTERS_PER_PAGE);
  const paginatedNewsletters = newsletters.slice(
    (currentPage - 1) * NEWSLETTERS_PER_PAGE,
    currentPage * NEWSLETTERS_PER_PAGE
  );

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 260, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    const maxVisiblePages = 9;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const halfWindow = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - halfWindow;
    let endPage = currentPage + halfWindow;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxVisiblePages + 1;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 font-lato">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-1 bg-gradient-to-b from-ppf-orange to-ppf-orange/50 rounded-full"></div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-lora font-black text-slate-900 tracking-tight">
                  Newsletters
                </h1>
              </div>
              <p className="text-lg text-slate-600 ml-6 max-w-2xl leading-relaxed">
                Stay informed with PPF&apos;s curated insights on policy, research, and developments shaping India&apos;s future.
              </p>
            </motion.div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-ppf-orange/20 border-t-ppf-orange"></div>
            </div>
          ) : newsletters.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-slate-100 rounded-2xl"
            >
              <FaFilePdf className="text-6xl text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-semibold">No newsletters published yet.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {paginatedNewsletters.map((newsletter, idx) => (
                <motion.div
                  key={newsletter._id || newsletter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-white hover:bg-gradient-to-r hover:from-ppf-orange/5 hover:to-transparent rounded-xl md:rounded-2xl shadow-md hover:shadow-xl border-2 border-slate-200 hover:border-ppf-orange/50 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="px-3 py-1.5 bg-ppf-orange/10 rounded-full flex items-center gap-2">
                        <FaCalendar className="text-ppf-orange text-xs" />
                        <span className="text-xs font-bold text-ppf-orange uppercase tracking-widest">
                          {newsletter.date ? new Date(newsletter.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          }) : 'No date'}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 group-hover:text-ppf-orange transition-colors leading-snug">
                      {newsletter.title}
                    </h2>

                    {newsletter.description && (
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-2">
                        {newsletter.description}
                      </p>
                    )}
                  </div>

                  {/* Right CTA */}
                  <a
                    href={newsletter.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-ppf-orange to-ppf-orange/90 hover:shadow-lg text-white font-bold rounded-xl md:rounded-2xl transition-all duration-300 group/btn whitespace-nowrap text-sm md:text-base"
                  >
                    <FaFilePdf className="text-lg" />
                    <span>Read PDF</span>
                    <FaArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              ))}
              {totalPages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-3 flex-wrap">
                  {totalPages > 9 && (
                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="min-w-[44px] h-11 rounded-full border border-slate-200 bg-white text-[#1a0b33] hover:border-ppf-purple hover:text-ppf-purple disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-[#1a0b33] transition-all flex items-center justify-center"
                      aria-label="Previous page"
                    >
                      <FaChevronLeft size={14} />
                    </button>
                  )}

                  {getVisiblePages().map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[44px] h-11 rounded-full border text-sm font-lato font-bold transition-all ${
                        pageNum === currentPage
                          ? "bg-ppf-purple text-white border-ppf-purple"
                          : "bg-white text-[#1a0b33] border-slate-200 hover:border-ppf-purple hover:text-ppf-purple"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {totalPages > 9 && (
                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="min-w-[44px] h-11 rounded-full border border-slate-200 bg-white text-[#1a0b33] hover:border-ppf-purple hover:text-ppf-purple disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-[#1a0b33] transition-all flex items-center justify-center"
                      aria-label="Next page"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
