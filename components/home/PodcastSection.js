"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMicrophoneAlt } from "react-icons/fa";

const VideoCard = ({ title, date, videoId }) => (
    <div className="flex flex-col gap-3 group">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg bg-slate-900 border border-slate-100">
            <iframe
                className="absolute inset-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        </div>
        <div className="px-1 mt-2">
            <h3 className="text-[15px] font-lora font-black text-slate-900 line-clamp-2 leading-[1.3] mb-1 group-hover:text-ppf-purple transition-colors">
                {title}
            </h3>
            <p className="text-[10px] font-lato text-slate-400 font-black uppercase tracking-[0.15em]">
                {date}
            </p>
        </div>
    </div>
);

export default function PodcastSection({ sectionWidth }) {
    const [youtubeVideoIds, setYoutubeVideoIds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch media data to reuse existing Youtube videos
    useEffect(() => {
        async function fetchMedia() {
            try {
                const res = await fetch("/api/media");
                const data = await res.json();
                if (data.success) {
                    const ids = data.data?.youtubeVideoIds || [];
                    const singleId = data.data?.youtubeVideoId;
                    const combined = Array.isArray(ids) && ids.length ? ids : singleId ? [singleId] : [];
                    setYoutubeVideoIds(combined.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean).slice(0, 3));
                }
            } catch (err) {
                console.error("PodcastSection: failed to fetch media", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMedia();
    }, []);

    // Fallback videos if none returned from API, to ensure the section looks populated
    const displayVideos = youtubeVideoIds.length > 0 ? youtubeVideoIds : ["dQw4w9WgXcQ", "dQw4w9WgXcQ", "dQw4w9WgXcQ"]; // Fallback to placeholder if needed

    return (
        <section className="relative py-20 z-10 w-full overflow-hidden">
            {/* Full-width Background styling for Podcast Section */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-[#f3f0fb] to-white pointer-events-none" />

            <div className={`relative ${sectionWidth}`}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between gap-8 mb-12"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-8 bg-ppf-purple" />
                            <span className="text-ppf-purple font-lora font-black uppercase text-[10px] tracking-wider">
                                Our Podcasts
                            </span>
                        </div>

                        <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-lora font-bold text-slate-800">
                            PPF Podcast <span className="text-ppf-purple">Series</span>
                            <div className="w-10 h-10 rounded-full bg-ppf-purple/10 flex items-center justify-center">
                                <FaMicrophoneAlt className="text-ppf-purple text-xl" />
                            </div>
                        </h2>

                        <p className="mt-4 text-slate-500 font-lato text-sm md:text-base max-w-xl">
                            Tune into our latest podcasts featuring insightful discussions on policy, research, and impact.
                        </p>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-ppf-purple/30 border-t-ppf-purple rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {displayVideos.map((videoId, idx) => (
                            <VideoCard
                                key={`${videoId}-${idx}`}
                                title={`PPF Podcast Episode ${idx + 1}`}
                                date="Latest Release"
                                videoId={videoId}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
