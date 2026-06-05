"use client";
import { useState, useEffect, useCallback } from "react";

export default function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full bg-white shadow-2xl hover:shadow-purple-200/50 flex items-center justify-center transition-all duration-500 group border border-slate-100"
      aria-label="Scroll to top"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28" cy="28" r="25"
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="4"
        />
        <circle
          cx="28" cy="28" r="25"
          fill="none"
          stroke="#0056b3"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 25}`}
          strokeDashoffset={`${2 * Math.PI * 25 * (1 - scrollProgress / 100)}`}
          className="transition-all duration-150"
        />
      </svg>
      <svg className="w-5 h-5 text-[#0056b3] group-hover:-translate-y-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path>
      </svg>
    </button>
  );
}
