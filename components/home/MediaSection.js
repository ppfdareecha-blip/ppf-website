"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaTimes,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdOutlineVideoLibrary } from "react-icons/md";
import Script from "next/script";

// ─── Sub-components (extracted from /pages/Media) ────────────────────────────

const SocialSectionHeader = ({ icon: Icon, title, colorClass }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className={`w-12 h-12 rounded-2xl ${colorClass} text-white flex items-center justify-center shadow-lg shadow-black/10`}>
      <Icon size={24} />
    </div>
    <h2 className="text-2xl font-lora font-black text-slate-800 tracking-tight uppercase leading-none">{title}</h2>
  </div>
);

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
    <div className="px-1">
      <h3 className="text-[13px] font-lora font-black text-slate-900 line-clamp-2 leading-[1.3] mb-1 group-hover:text-ppf-purple transition-colors">{title}</h3>
      <p className="text-[9px] font-lato text-slate-400 font-black uppercase tracking-[0.15em]">{date}</p>
    </div>
  </div>
);

const TwitterEmbedCard = ({ url, html }) => (
  <div className="w-full h-[480px] border border-slate-100 rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-2 overflow-hidden">
    {html ? (
      <div className="w-full h-full flex justify-center" dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <blockquote className="twitter-tweet" data-theme="light">
        <a href={url}>View post on X</a>
      </blockquote>
    )}
  </div>
);

const LinkedInEmbedCard = ({ urn }) => (
  <div className="h-full w-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl group relative">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0077B5]/5 to-transparent opacity-50 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none z-0" />
    <iframe
      src={`https://www.linkedin.com/embed/feed/update/${urn}?collapsed=1`}
      height="100%"
      width="100%"
      frameBorder="0"
      allowFullScreen
      title="LinkedIn post"
      className="relative z-10"
      loading="lazy"
    />
  </div>
);

const InstagramEmbedCard = ({ postUrl, html }) => {
  let src = "";
  const match = html?.match(/data-instgrm-permalink="([^"]+)"/);
  if (match && match[1]) {
    const baseUrl = match[1].split("?")[0];
    src = baseUrl.endsWith("/") ? `${baseUrl}embed/` : `${baseUrl}/embed/`;
  }
  if (!src && postUrl) {
    const baseUrl = postUrl.split("?")[0];
    src = baseUrl.endsWith("/") ? `${baseUrl}embed/` : `${baseUrl}/embed/`;
  }
  if (!src) return (
    <div className="h-full w-full rounded-[2.5rem] border border-dashed border-slate-200 bg-white shadow-xl flex items-center justify-center text-slate-400 font-lato font-bold text-sm">
      No Instagram link set
    </div>
  );
  return (
    <div className="h-full w-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl relative">
      <iframe src={src} className="w-full h-full absolute inset-0" frameBorder="0" allow="encrypted-media" loading="lazy" />
    </div>
  );
};

const StackedSocialColumn = ({ title, icon, colorClass, posts, type }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!posts.length) return (
    <div className="flex flex-col">
      <div className="mb-8"><SocialSectionHeader icon={icon} title={title} colorClass={colorClass} /></div>
      <div className="h-[520px] w-full rounded-[2.5rem] border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 font-lato font-bold text-sm">No link set</div>
    </div>
  );
  return (
    <div className="flex flex-col">
      <div className="mb-8"><SocialSectionHeader icon={icon} title={title} colorClass={colorClass} /></div>
      <div className="relative h-[650px] w-full perspective-1000">
        {posts.map((post, idx) => {
          const isVisible = idx >= activeIndex;
          const isTop = idx === activeIndex;
          const stackIndex = idx - activeIndex;
          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? stackIndex * 35 : -200,
                y: isVisible ? stackIndex * 15 : -100,
                rotateZ: isVisible ? stackIndex * 1.5 : -15,
                scale: isVisible ? 1 : 0.9,
                zIndex: posts.length - idx,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30, opacity: { duration: 0.3 } }}
              className={`absolute top-0 left-0 w-[85%] h-[520px] ${isTop ? "cursor-default" : "cursor-pointer"} ${!isVisible ? "pointer-events-none" : ""}`}
            >
              <div className="w-full h-full transform-gpu shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-slate-100 overflow-hidden relative group">
                {!isTop && isVisible && (
                  <div
                    className="absolute inset-0 z-30 cursor-pointer bg-black/5 hover:bg-black/0 transition-colors flex items-center justify-end p-6"
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Click to view</div>
                  </div>
                )}
                {type === "linkedin"
                  ? <LinkedInEmbedCard urn={post} />
                  : <InstagramEmbedCard postUrl={post} html={post?.startsWith("<") ? post : ""} />
                }
                <AnimatePresence>
                  {isTop && activeIndex > 0 && (
                    <motion.button
                      initial={{ opacity: 0, x: -10, y: "-50%" }}
                      animate={{ opacity: 0.7, x: 0, y: "-50%" }}
                      exit={{ opacity: 0, x: -10, y: "-50%" }}
                      whileHover={{ opacity: 1, scale: 1.1, backgroundColor: "#4a2790ff" }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => { e.stopPropagation(); setActiveIndex(activeIndex - 1); }}
                      className="absolute left-4 top-1/2 w-10 h-10 rounded-full bg-slate-300/80 backdrop-blur-md shadow-xl border border-slate-700/50 flex items-center justify-center text-white z-40 group"
                    >
                      <FaChevronLeft size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isTop && activeIndex < posts.length - 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: 10, y: "-50%" }}
                      animate={{ opacity: 0.7, x: 0, y: "-50%" }}
                      exit={{ opacity: 0, x: 10, y: "-50%" }}
                      whileHover={{ opacity: 1, scale: 1.1, backgroundColor: "#6228d7" }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => { e.stopPropagation(); setActiveIndex(activeIndex + 1); }}
                      className="absolute right-4 top-1/2 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md shadow-xl border border-slate-700/50 flex items-center justify-center text-white z-40 group"
                    >
                      <FaChevronRight size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Media Modal ──────────────────────────────────────────────────────────────

function MediaModal({ isOpen, onClose, mediaLinks, loading, scrollToId }) {
  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && scrollToId) {
      // Small delay to allow the modal to animate in before scrolling
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToId]);

  const normalizeSlots = (values, fallback = "") => {
    const rawValues = Array.isArray(values) && values.length ? values : [fallback || values];
    return rawValues.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean).slice(0, 3);
  };

  const youtubeVideoIds = normalizeSlots(mediaLinks.youtubeVideoIds, mediaLinks.youtubeVideoId);
  const linkedinPosts = normalizeSlots(mediaLinks.linkedinUrns, mediaLinks.linkedinUrn);
  const instagramPosts = normalizeSlots(mediaLinks.instagramPostUrls, mediaLinks.instagramPostUrl);
  const xPosts = normalizeSlots(mediaLinks.xPostUrls, mediaLinks.xPostUrl).map((url) => ({ url }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 flex flex-col h-full max-h-screen bg-white rounded-t-3xl mt-12 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-ppf-purple flex items-center justify-center">
                  <MdOutlineVideoLibrary className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-[10px] font-lato font-black text-ppf-purple uppercase tracking-[0.25em]">Policy Perspectives Foundation</p>
                  <h2 className="text-xl font-lora font-black text-slate-800 leading-none">Media &amp; Socials</h2>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.youtube.com/channel/UCFp9m6S-MhE3mQ3rX88Y4aQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 text-[11px] font-lato font-black text-slate-400 hover:text-[#FF0000] uppercase tracking-widest transition-colors"
                >
                  YouTube <HiOutlineExternalLink />
                </a>
                <button
                  onClick={onClose}
                  id="media-modal-close"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-ppf-purple hover:text-white flex items-center justify-center text-slate-500 transition-all"
                  aria-label="Close media panel"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">

                {/* YouTube */}
                <section id="media-youtube" className="scroll-mt-24">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <SocialSectionHeader icon={FaYoutube} title="Video Briefings" colorClass="bg-[#FF0000]" />
                    <div className="mb-6">
                      <a href="https://www.youtube.com/channel/UCFp9m6S-MhE3mQ3rX88Y4aQ" target="_blank" rel="noopener noreferrer" className="text-sm font-lora font-black text-slate-400 hover:text-[#FF0000] uppercase tracking-widest transition-colors flex items-center gap-2 group">
                        View Channel <HiOutlineExternalLink className="group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                  {loading ? (
                    <p className="text-slate-500 font-lato">Loading videos…</p>
                  ) : youtubeVideoIds.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {youtubeVideoIds.map((videoId, idx) => (
                        <VideoCard key={`${videoId}-${idx}`} title={`Featured PPF Video ${idx + 1}`} date="Latest update" videoId={videoId} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm font-lato font-bold text-slate-400">No YouTube video link set.</div>
                  )}
                </section>

                {/* LinkedIn + Instagram */}
                <section className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div id="media-linkedin" className="scroll-mt-24">
                      <StackedSocialColumn title="LinkedIn Network" icon={FaLinkedinIn} colorClass="bg-[#0077B5]" posts={linkedinPosts} type="linkedin" />
                    </div>
                    <div id="media-instagram" className="scroll-mt-24">
                      <StackedSocialColumn title="Instagram Highlights" icon={FaInstagram} colorClass="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" posts={instagramPosts} type="insta" />
                    </div>
                  </div>
                </section>

                {/* X (Twitter) */}
                <section id="media-twitter" className="scroll-mt-24">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <SocialSectionHeader icon={FaXTwitter} title="X Perspectives" colorClass="bg-black" />
                    <div className="mb-6">
                      <a href="https://x.com/PPFNewDelhi" target="_blank" rel="noopener noreferrer" className="text-sm font-lora font-black text-slate-400 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-2 group">
                        Follow @PPF <HiOutlineExternalLink className="group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                  {xPosts.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {xPosts.map((post, idx) => (
                        <div key={idx} className="max-w-[450px] mx-auto w-full">
                          <TwitterEmbedCard html={post.html} url={post.url} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm font-lato font-bold text-slate-400">No X post link set.</div>
                  )}
                </section>

              </div>
            </div>
          </motion.div>

          {/* Social scripts */}
          <Script async src="//www.instagram.com/embed.js" strategy="afterInteractive" />
          <Script async src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Main MediaSection (teaser strip + modal) ─────────────────────────────────

const SOCIAL_PLATFORMS = [
  { icon: FaYoutube, label: "YouTube", color: "#FF0000", bg: "bg-red-50 hover:bg-red-100", text: "text-[#FF0000]", id: "media-youtube" },
  { icon: FaLinkedinIn, label: "LinkedIn", color: "#0077B5", bg: "bg-blue-50 hover:bg-blue-100", text: "text-[#0077B5]", id: "media-linkedin" },
  { icon: FaInstagram, label: "Instagram", color: "#ee2a7b", bg: "bg-pink-50 hover:bg-pink-100", text: "text-[#ee2a7b]", id: "media-instagram" },
  { icon: FaXTwitter, label: "X / Twitter", color: "#000", bg: "bg-slate-100 hover:bg-slate-200", text: "text-slate-900", id: "media-twitter" },
];

export default function MediaSection({ sectionWidth }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollToId, setScrollToId] = useState(null);

  const handleOpenModal = (id = null) => {
    setScrollToId(id);
    setIsModalOpen(true);
  };
  const [mediaLinks, setMediaLinks] = useState({
    youtubeVideoId: "", instagramPostUrl: "", linkedinUrn: "", xPostUrl: "",
    youtubeVideoIds: [], instagramPostUrls: [], linkedinUrns: [], xPostUrls: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch media data (same API as the old Media page)
  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch("/api/media");
        const data = await res.json();
        if (data.success) {
          setMediaLinks({
            youtubeVideoId: data.data?.youtubeVideoId || "",
            instagramPostUrl: data.data?.instagramPostUrl || "",
            linkedinUrn: data.data?.linkedinUrn || "",
            xPostUrl: data.data?.xPostUrl || "",
            youtubeVideoIds: data.data?.youtubeVideoIds || [],
            instagramPostUrls: data.data?.instagramPostUrls || [],
            linkedinUrns: data.data?.linkedinUrns || [],
            xPostUrls: data.data?.xPostUrls || [],
          });
        }
      } catch (err) {
        console.error("MediaSection: failed to fetch media", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  // Listen for global "open-media-modal" event (triggered by Navbar on home page)
  useEffect(() => {
    const handler = () => handleOpenModal();
    window.addEventListener("open-media-modal", handler);
    return () => window.removeEventListener("open-media-modal", handler);
  }, []);

  // Handle cross-page navigation: if Navbar set a sessionStorage flag, open modal on mount
  useEffect(() => {
    if (sessionStorage.getItem("openMediaModal") === "1") {
      sessionStorage.removeItem("openMediaModal");
      // Small delay to let the page render first
      const t = setTimeout(() => handleOpenModal(), 400);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      {/* ── TEASER STRIP ────────────────────────────────────────────── */}
      <section
        id="media"
        className={`relative py-20 px-6 z-10 ${sectionWidth} overflow-hidden`}
      >
        {/* Soft background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-ppf-purple/5 via-transparent to-slate-50 pointer-events-none rounded-3xl" />

        <div className="relative container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-ppf-purple" />
                <span className="text-ppf-purple font-lora font-black uppercase text-[10px] tracking-wider">
                  Media &amp; Socials
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-lora font-bold text-slate-800">
                Stay Connected &amp; <span className="text-ppf-purple">Informed</span>
              </h2>
              <p className="mt-3 text-slate-500 font-lato text-sm md:text-base max-w-xl">
                Follow our latest video briefings, policy discussions, and social media conversations across platforms.
              </p>
            </div>

            <motion.button
              id="open-media-modal-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="flex-shrink-0 flex items-center gap-3 bg-ppf-purple text-white px-8 py-4 font-lato font-extrabold uppercase tracking-widest hover:bg-ppf-purple/90 transition-all shadow-xl shadow-ppf-purple/20 text-sm rounded-full"
            >
              <MdOutlineVideoLibrary className="text-lg" />
              Explore Our Media
            </motion.button>
          </motion.div>

          {/* Platform Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {SOCIAL_PLATFORMS.map(({ icon: Icon, label, bg, text, id }) => (
              <motion.button
                key={label}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpenModal(id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer w-full`}
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`${text} text-xl`} />
                </div>
                <span className="text-sm font-lato font-bold text-slate-700">{label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FULL-SCREEN MODAL ───────────────────────────────────────── */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mediaLinks={mediaLinks}
        loading={loading}
        scrollToId={scrollToId}
      />
    </>
  );
}
