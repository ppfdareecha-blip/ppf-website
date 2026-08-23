"use client";
import React from "react";

export default function HeroSection() {
  return (
    /* 1. Maintaining the reduced height as requested */
    <section className="relative py-12 flex items-center justify-center overflow-hidden selection:bg-ppf-orange selection:text-white">

      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage:
            "url('/partners_banner.jpeg')",
        }}
      ></div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-950/50"></div>

      {/* Brand Glow Effect - Using ppf-purple */}
      <div className="absolute top-[-350px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-ppf-purple opacity-20 blur-[120px] rounded-full"></div>

      {/* Content */}
      <div className="relative container mx-auto px-6 text-center text-white">

        {/* 2. Headline using ppf-purple */}
        <h1 className="text-3xl md:text-6xl font-lora mb-2 leading-tight uppercase">
          Partner with <span className="text-purple-200">Purpose</span>
        </h1>

        {/* 3. Subtext with high contrast */}
        <p className="text-sm md:text-lg max-w-xl mx-auto mb-4 leading-relaxed text-slate-100 font-medium">
         &quot; Ideas. <span className="text-ppf-orange"> Partnerships. </span> Lasting Impact &quot;
        </p>

        {/* Optional: Subtle accent line */}
        <div className="w-12 h-1 bg-ppf-teal mx-auto rounded-full opacity-60"></div>
      </div>
    </section>
  );
}