"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ProjectGallery = ({ images, folder }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="mt-24 border-t border-slate-200 pt-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-ppf-purple font-serif mb-4">Impact in Action</h2>
                <div className="w-20 h-1.5 bg-ppf-orange rounded-full mx-auto"></div>
            </div>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {images.map((img, idx) => (
                    <motion.div
                        key={idx}
                        className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer relative group bg-slate-100 shadow-sm"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: (idx % 4) * 0.1, ease: "easeOut" }}
                        onClick={() => setSelectedImage(`/${folder}/${img}`)}
                    >
                        <img
                            src={`/${folder}/${img}`}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ppf-purple/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                            <span className="text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                View Image
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 md:p-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 bg-white/10 hover:bg-white/20 hover:text-white p-3 rounded-full transition-all duration-300 z-10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <motion.div
                            className="relative max-w-6xl w-full h-full flex items-center justify-center"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Selected gallery image"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectGallery;
