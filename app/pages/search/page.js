"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { searchGlobal } from "@/lib/search";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileAlt, FaCalendarAlt, FaUser, FaSearch, FaArrowRight } from "react-icons/fa";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (query) {
      // We'll pass a limit of 100 for the full search page
      const allResults = searchGlobal(query); 
      setResults(allResults);
    }
  }, [query]);

  const filters = ["All", "Opinion", "Event", "Team Member", "Publication", "Course", "Page"];
  
  const filteredResults = activeFilter === "All" 
    ? results 
    : results.filter(r => r.type === activeFilter);

  const getIcon = (type) => {
    switch (type) {
      case 'Opinion': return <FaFileAlt className="text-blue-500" />;
      case 'Event': return <FaCalendarAlt className="text-ppf-orange" />;
      case 'Team Member': return <FaUser className="text-ppf-purple" />;
      case 'Publication': return <FaFileAlt className="text-ppf-teal" />;
      case 'Course': return <FaCalendarAlt className="text-ppf-purple" />;
      case 'Page': return <FaSearch className="text-gray-400" />;
      default: return <FaSearch />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-lora font-black text-slate-900 tracking-tighter">
            Search <span className="text-ppf-purple">Results.</span>
          </h1>
          <p className="text-slate-500 mt-4 font-lato text-lg">
            Showing results for <span className="font-bold text-slate-900">&quot;{query}&quot;</span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                activeFilter === f 
                ? "bg-ppf-purple text-white border-ppf-purple shadow-lg shadow-purple-100" 
                : "bg-white text-slate-600 border-slate-200 hover:border-ppf-purple hover:text-ppf-purple"
              }`}
            >
              {f} {activeFilter === f || f === "All" ? "" : `(${results.filter(r => r.type === f).length})`}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredResults.length > 0 ? (
              filteredResults.map((result, idx) => (
                <motion.div
                  key={`${result.type}-${result.id}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    href={result.href}
                    className="group block p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-ppf-purple hover:bg-white transition-all duration-300"
                  >
                    <div className="flex items-center sm:items-start gap-4 sm:gap-5">
                      <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm group-hover:scale-110 transition-transform shrink-0">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-ppf-purple bg-purple-50 px-2 py-0.5 rounded">
                            {result.type}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-lora font-black text-slate-900 group-hover:text-ppf-purple transition-colors truncate">
                          {result.title}
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2 leading-relaxed font-medium">
                          {result.excerpt}
                        </p>
                        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-bold text-ppf-purple sm:opacity-0 group-hover:opacity-100 transition-all transform sm:translate-x-[-10px] group-hover:translate-x-0">
                          View Details <FaArrowRight size={10} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-slate-300 text-3xl" />
                </div>
                <h3 className="text-2xl font-lora font-bold text-slate-900">No matches found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you&apos;re looking for.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
