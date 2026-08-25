"use client";

import React, { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditorialProjectLayout({
    title,
    subtitle,
    paragraphs,
    highlights,
    images,
    folder,
    reportLink
}) {
    const [selectedImage, setSelectedImage] = useState(null);

    const heroImage = images[0];
    const introImages = images.slice(1, 3);
    const middleImages = images.slice(3, 6);
    const bottomGridImages = images.slice(6);

    const ImageBox = ({ img, className = "" }) => (
        <motion.div
            className={`cursor-pointer overflow-hidden relative group bg-slate-200 ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedImage(`/${folder}/${img}`)}
        >
            <img
                src={`/${folder}/${img}`}
                alt="Impact"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </motion.div>
    );

    return (
        <main className="pb-16 text-slate-900 bg-slate-50 min-h-screen relative overflow-hidden">
            {/* Subtle Background Blobs to fill white space */}
            <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-ppf-orange/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-[50%] right-[-10%] w-[30rem] h-[30rem] bg-ppf-purple/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* 1. Hero Section tightly integrated */}
            <div className="relative w-full h-[50vh] md:h-[65vh] mb-8 md:mb-12 rounded-b-[2rem] md:rounded-b-[3rem] overflow-hidden shadow-xl z-10">
                {heroImage && <ImageBox img={heroImage} className="absolute inset-0 w-full h-full" />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent z-10"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:px-16 z-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 font-serif leading-tight"
                    >
                        {title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "5rem" }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="h-1.5 md:h-2 bg-ppf-orange rounded-full mb-4 md:mb-6"
                    ></motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className={`text-lg md:text-2xl text-slate-200 font-light max-w-4xl leading-relaxed ${reportLink ? 'mb-6 md:mb-8' : ''}`}
                    >
                        {subtitle}
                    </motion.p>
                    <motion.div
                        className="flex flex-wrap items-center gap-4 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        {reportLink && (
                            <a
                                href={reportLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-ppf-orange text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors shadow-lg"
                            >
                                Access Report
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        )}
                        <a
                            href="/pages/publications#projects"
                            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg"
                        >
                            Project Reports
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-20 relative z-20">

                {/* 2. Intro Text overlapping with Side Images */}
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="lg:col-span-6 space-y-6 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 z-20 relative">
                        {paragraphs[0] && (
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-xl md:text-2xl text-ppf-purple font-serif leading-relaxed italic border-l-4 border-ppf-orange pl-5"
                            >
                                {paragraphs[0]}
                            </motion.p>
                        )}
                        {paragraphs[1] && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-base md:text-lg text-slate-700 leading-relaxed"
                            >
                                {paragraphs[1]}
                            </motion.p>
                        )}
                    </div>
                    {/* Position relative to respect z-index, removing negative margin to prevent overlap clipping text */}
                    <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6 z-10 relative">
                        {introImages[0] && <ImageBox img={introImages[0]} className="h-48 md:h-72 lg:h-80 rounded-2xl md:rounded-3xl shadow-lg mt-8 md:mt-16" />}
                        {introImages[1] && <ImageBox img={introImages[1]} className="h-56 md:h-80 lg:h-[24rem] rounded-2xl md:rounded-3xl shadow-lg" />}
                    </div>
                </div>

                {/* 3. Middle Text interlocking Image Grid */}
                <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center bg-ppf-lilac/10 rounded-3xl p-4 md:p-8 border border-ppf-purple/5">
                    <div className="lg:col-span-7 grid grid-cols-12 gap-3 md:gap-4 h-full">
                        {middleImages[0] && <ImageBox img={middleImages[0]} className="col-span-12 md:col-span-8 h-48 md:h-full min-h-[16rem] rounded-2xl shadow-md" />}
                        <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-3 md:gap-4 h-full">
                            {middleImages[1] && <ImageBox img={middleImages[1]} className="h-32 md:h-full rounded-2xl shadow-md" />}
                            {middleImages[2] && <ImageBox img={middleImages[2]} className="h-32 md:h-full rounded-2xl shadow-md" />}
                        </div>
                    </div>
                    <div className="lg:col-span-5 space-y-6">
                        {paragraphs[2] && (
                            <p className="text-lg text-slate-700 leading-relaxed font-medium bg-white/60 p-5 rounded-2xl shadow-sm">
                                {paragraphs[2]}
                            </p>
                        )}
                        <div className="bg-white border-l-4 border-ppf-purple rounded-r-3xl rounded-l-md p-6 md:p-8 shadow-md">
                            <h3 className="text-xl md:text-2xl font-bold text-ppf-purple mb-6 relative">
                                Highlights of Impact
                            </h3>
                            <ul className="space-y-3">
                                {highlights.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-ppf-orange shrink-0 mt-0.5" />
                                        <span className="text-slate-800 text-sm md:text-base font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. Dense Masonry Waterfall (Less gap) */}
                {bottomGridImages.length > 0 && (
                    <div className="pt-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                            <h2 className="text-2xl md:text-4xl font-bold text-ppf-purple font-serif shrink-0">Journey Gallery</h2>
                            <div className="h-[2px] bg-slate-200 w-full rounded"></div>
                        </div>
                        {/* Reduced gap to 3 (0.75rem), tight integration */}
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3 pb-8">
                            {bottomGridImages.map((img, idx) => (
                                <ImageBox key={idx} className="rounded-xl shadow-sm break-inside-avoid" img={img} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 md:p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 bg-white/10 hover:bg-white/20 hover:text-white p-2 md:p-3 rounded-full transition-all duration-300 z-[110]"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <motion.div
                            className="relative max-w-7xl w-full h-[90vh] flex items-center justify-center z-[105]"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Selected gallery zoom"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
