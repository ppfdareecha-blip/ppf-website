"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaBars, FaTimes, FaChevronDown, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaFileAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          if (data.success) {
            setSearchResults(data.results.slice(0, 15));
            setShowResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      window.location.href = searchResults[selectedIndex].href;
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/pages/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'Opinion': return <FaFileAlt className="text-blue-500" />;
      case 'Event': return <FaCalendarAlt className="text-ppf-orange" />;
      case 'Team Member': return <FaUser className="text-ppf-purple" />;
      case 'Publication': return <FaFileAlt className="text-ppf-teal" />;
      case 'Course': return <FaCalendarAlt className="text-ppf-purple" />;
      case 'Page': return <FaSearch className="text-gray-400" />;
      default: return <FaSearch className="text-gray-400" />;
    }
  };

  const navLinks = [
    {
      name: "Home", href: "/",
      dropdown: [
        { name: "About us", href: "/#about" },
        { name: "Centers", href: "/#centers" },
        { name: "Recent Activities", href: "/#activities" },
        { name: "Have a Question ?", href: "/#queries" },
      ]
    },
    {
      name: "Publications",
      href: "/pages/publications",
      dropdown: [
        { name: "Research Reports", href: "/pages/publications/#scholars" },
        { name: "Annual Reports", href: "/pages/publications/#annualReport" },
        { name: "Project Reports", href: "/pages/publications/#projects" },
      ]
    },
    {
      name: "Events",
      href: "/pages/activities",
      dropdown: [
        { name: "Upcoming Events", href: "/pages/activities?tab=upcoming" },
        { name: "Past Events", href: "/pages/activities?tab=past" },
      ]
    },
    { name: "Opinions", href: "/pages/opinions" },
    {
      name: "Collaboration",
      href: "/pages/collaboration",
      dropdown: [
        { name: "Career", href: "/pages/collaboration/#internships" },
        { name: "Courses", href: "/pages/collaboration/#courses" },
        { name: "Donate", href: "/pages/collaboration/#donate" },
      ]
    },
    { name: "Media", href: "/pages/Media" },
  ];

  const socialIcons = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com/profile.php?id=100068783625651" },
    { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/company/policy-perspectives-foundation-ppf-%E0%A4%A8%E0%A5%80%E0%A4%A4%E0%A4%BF-%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AF-%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%A8/" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/policy_perspectives_foundation/" },
    { icon: <FaYoutube />, href: "https://www.youtube.com/@policyperspectivesfoundati8429" },
  ];

  return (
    /* REMOVED overflow-x-hidden here to allow dropdowns to be visible */
    <nav className="w-full sticky top-0 z-[100] shadow-md bg-white">
      {/* --- TOP BAR (Purple) --- */}
      <div className="bg-ppf-purple text-white py-1.5 px-4 md:px-12 relative z-[101]">
        <div className="max-w-7xl mx-auto flex justify-between md:justify-end items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-5 md:border-r border-ppf-purple md:pr-8">
            {socialIcons.map((social, i) => (
              <a key={i} target="_blank" href={social.href} className="hover:text-purple-300 transition-colors text-sm sm:text-base">
                {social.icon}
              </a>
            ))}
          </div>

          <Link
            href="/pages/collaboration/#donate"
            className="bg-white text-ppf-purple hover:bg-purple-100 px-4 md:px-6 py-1 rounded-full font-extrabold text-[10px] md:text-[13px] transition-all uppercase tracking-widest shadow-sm whitespace-nowrap"
          >
            Donate
          </Link>
        </div>
      </div>

      {/* --- MAIN BAR (White) --- */}
      <div className="bg-white border-b border-gray-100 py-2.5 px-4 md:px-12 relative z-[100]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">

          {/* BRANDING */}
          <Link href="/" className="flex items-center gap-2 sm:gap-4 group shrink">
            <div className="relative h-8 w-8 sm:h-14 sm:w-14 shrink-0">
              <Image
                src="/image.png"
                alt="PPF Logo"
                fill
                sizes="(max-width: 768px) 32px, 56px"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col font-extrabold min-w-0">
              <span className="text-ppf-purple font-helvetica text-sm sm:text-xl uppercase truncate">Policy Perspectives</span>
              <span className="text-ppf-purple font-helvetica text-[8px] sm:text-lg text-center tracking-wide  uppercase truncate">Foundation</span>
            </div>
          </Link>

          {/* DESKTOP NAV & PERMANENT SEARCH */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center relative" onMouseLeave={() => setHoveredIndex(null)}>
              {navLinks.map((link, index) => (
                <div key={link.name} className="relative py-2 font-lato" onMouseEnter={() => setHoveredIndex(index)}>
                  <Link
                    href={link.href}
                    className={`relative z-10 px-3 py-1.5 text-sm font-extrabold transition-colors flex items-center gap-2 ${hoveredIndex === index ? 'text-ppf-purple' : 'text-gray-700'}`}
                  >
                    <span className="relative flex items-center gap-2">
                      {link.name}
                      {link.dropdown && <FaChevronDown className={`text-[11px] transition-transform ${hoveredIndex === index ? 'rotate-180' : ''}`} />}

                      {hoveredIndex === index && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute -inset-x-3 -inset-y-1.5 bg-purple-50 rounded-lg -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </span>
                  </Link>

                  <AnimatePresence>
                    {link.dropdown && hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        /* Ensure z-index here is high enough to be over the next section */
                        className="absolute top-full left-0 w-56 bg-white shadow-2xl border-t-4 border-ppf-purple py-3 mt-1 z-[110] rounded-b-md"
                      >
                        {link.dropdown.map((sub) => (
                          <Link key={sub.name} href={sub.href} className="block px-5 py-3 text-[13px] text-gray-700 hover:bg-purple-50 hover:text-ppf-purple font-bold transition-colors">{sub.name}</Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div ref={searchRef} className="relative group ml-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search publications, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="bg-gray-100 text-sm border border-transparent focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none pl-5 pr-12 py-2 rounded-full max-w-32 xl:w-64 transition-all duration-300 font-medium text-slate-900"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ppf-purple transition-colors">
                  <FaSearch className="text-lg" />
                </button>
              </form>

              {/* LIVE RESULTS DROPDOWN */}
              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 w-80 xl:w-96 bg-white shadow-2xl border border-gray-100 rounded-2xl mt-2 overflow-hidden z-[200]"
                  >
                    <div className="p-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Quick Results</span>
                      <span className="text-[10px] text-gray-400">Press Enter to view all</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto py-2">
                      {searchResults.map((result, idx) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.href}
                          onClick={() => setShowResults(false)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-purple-50 transition-colors group ${selectedIndex === idx ? 'bg-purple-50' : ''}`}
                        >
                          <div className="mt-1 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold uppercase text-ppf-purple bg-purple-50 px-1.5 py-0.5 rounded leading-none">
                                {result.type}
                              </span>
                            </div>
                            <span className="text-[13px] font-bold text-gray-800 truncate mt-1">{result.title}</span>
                            <span className="text-[11px] text-gray-500 truncate">{result.excerpt}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/pages/search?q=${encodeURIComponent(searchQuery)}`}
                      className="block text-center py-3 text-xs font-bold text-ppf-purple bg-gray-50 hover:bg-purple-100 transition-colors"
                      onClick={() => setShowResults(false)}
                    >
                      See all results for &quot;{searchQuery}&quot;
                    </Link>
                  </motion.div>
                )}
                {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-80 bg-white shadow-2xl border border-gray-100 rounded-2xl mt-2 p-8 text-center z-[200]"
                  >
                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaSearch className="text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">No results found</p>
                    <p className="text-xs text-gray-500 mt-1">Try searching for something else</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-ppf-purple text-2xl sm:text-3xl shrink-0">
            <FaBars />
          </button>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-ppf-purple/60 z-[120] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[130] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col leading-none">
                  <span className="text-ppf-purple font-lora text-lg uppercase truncate">Policy Perspectives</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-ppf-purple text-3xl"><FaTimes /></button>
              </div>

              {/* Mobile Search */}
              <div className="mb-6 relative" ref={mobileSearchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-100 rounded-xl py-3 px-4 outline-none border text-base focus:border-ppf-purple text-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  />
                  <button type="submit" className="absolute right-4 top-3 text-gray-400">
                    <FaSearch className="text-lg" />
                  </button>
                </form>

                {/* MOBILE LIVE RESULTS */}
                <AnimatePresence>
                  {showResults && searchResults.length > 0 && isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 right-0 bg-white shadow-xl border border-gray-100 rounded-xl mt-2 overflow-hidden z-[150] max-h-[60vh] flex flex-col"
                    >
                      <div className="p-2 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center shrink-0">
                        <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">Search Results</span>
                      </div>
                      <div className="overflow-y-auto py-1">
                        {searchResults.map((result) => (
                          <Link
                            key={`mobile-${result.type}-${result.id}`}
                            href={result.href}
                            onClick={() => {
                              setShowResults(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-start gap-3 px-3 py-3 border-b border-gray-50 last:border-0 active:bg-purple-50"
                          >
                            <div className="mt-0.5 p-1.5 bg-gray-50 rounded group-hover:bg-white transition-colors">
                              {getResultIcon(result.type)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[12px] font-bold text-gray-800 line-clamp-1">{result.title}</span>
                              <span className="text-[10px] text-gray-500 line-clamp-1">{result.excerpt}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/pages/search?q=${encodeURIComponent(searchQuery)}`}
                        className="block text-center py-3 text-[11px] font-black text-ppf-purple bg-purple-50 uppercase tracking-tight shrink-0"
                        onClick={() => {
                          setShowResults(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        View All Results
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto">
                {navLinks.map((link, idx) => (
                  <div key={link.name} className="flex flex-col border-b border-gray-50">
                    <div className="flex justify-between items-center">
                      <Link
                        href={link.href}
                        className="text-gray-800 text-sm font-lora py-4 uppercase tracking-wide"
                        onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                      {link.dropdown && (
                        <button onClick={() => setMobileSubMenuOpen(mobileSubMenuOpen === idx ? null : idx)} className="p-4 text-purple-600">
                          <FaChevronDown className={`text-sm transition-transform duration-300 ${mobileSubMenuOpen === idx ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {link.dropdown && mobileSubMenuOpen === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden flex flex-col bg-gray-50 rounded-xl mb-4"
                        >
                          {link.dropdown.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="px-6 py-3 text-xs text-gray-700 font-bold active:text-ppf-purple"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}