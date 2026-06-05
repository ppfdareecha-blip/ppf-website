"use client";

import { useState, useEffect } from "react";
import {
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6"; // Standard for X (formerly Twitter)
import { HiOutlineExternalLink } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

// --- Sub-Components ---

import { motion, AnimatePresence } from "framer-motion";

// --- Sub-Components ---

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
      ></iframe>
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
      <div
        className="w-full h-full flex justify-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    ) : (
      <blockquote className="twitter-tweet" data-theme="light">
        <a href={url}>View post on X</a>
      </blockquote>
    )}
  </div>
);

const LinkedInEmbedCard = ({ urn }) => (
  <div className="h-full w-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl group relative">
     <div className="absolute inset-0 bg-gradient-to-br from-[#0077B5]/5 to-transparent opacity-50 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none z-0"></div>
     <iframe
       src={`https://www.linkedin.com/embed/feed/update/${urn}?collapsed=1`}
       height="100%"
       width="100%"
       frameBorder="0"
       allowFullScreen
       title="LinkedIn post"
       className="relative z-10"
     >
     </iframe>
  </div>
);

const InstagramEmbedCard = ({ postUrl, html }) => {
  let src = "";
  const match = html?.match(/data-instgrm-permalink="([^"]+)"/);
  
  if (match && match[1]) {
    // Remove query parameters like ?utm_source=ig_embed
    const baseUrl = match[1].split('?')[0];
    // Ensure it ends with a slash, then append 'embed/'
    src = baseUrl.endsWith('/') ? `${baseUrl}embed/` : `${baseUrl}/embed/`;
  }

  // Fallback just in case parsing fails
  if (!src && postUrl) {
    const baseUrl = postUrl.split("?")[0];
    src = baseUrl.endsWith("/") ? `${baseUrl}embed/` : `${baseUrl}/embed/`;
  }

  if (!src && html) {
    return (
      <div className="flex justify-center bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl p-2 h-full w-full">
        <div 
          className="w-full h-full flex justify-center overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  if (!src) {
    return (
      <div className="h-full w-full rounded-[2.5rem] border border-dashed border-slate-200 bg-white shadow-xl flex items-center justify-center text-slate-400 font-lato font-bold text-sm">
        No Instagram link set
      </div>
    );
  }

  // Direct iframe embed - much more stable than relying on Instagram's embed.js during React state changes
  return (
    <div className="h-full w-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl relative">
      <iframe
        src={src}
        className="w-full h-full absolute inset-0"
        frameBorder="0"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
};

const StackedSocialColumn = ({ title, icon, colorClass, posts, type }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!posts.length) {
    return (
      <div className="flex flex-col">
        <div className="mb-8">
          <SocialSectionHeader icon={icon} title={title} colorClass={colorClass} />
        </div>
        <div className="h-[520px] w-full rounded-[2.5rem] border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 font-lato font-bold text-sm">
          No link set
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <SocialSectionHeader icon={icon} title={title} colorClass={colorClass} />
      </div>
      
      {/* Container for the stack */}
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
                x: isVisible ? (stackIndex * 35) : -200, // Increased offset for better edge visibility
                y: isVisible ? (stackIndex * 15) : -100,
                rotateZ: isVisible ? (stackIndex * 1.5) : -15,
                scale: isVisible ? 1 : 0.9,
                zIndex: posts.length - idx,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 30,
                opacity: { duration: 0.3 }
              }}
              className={`absolute top-0 left-0 w-[85%] h-[520px] ${
                isTop ? "cursor-default" : "cursor-pointer"
              } ${!isVisible ? "pointer-events-none" : ""}`}
            >
              <div className="w-full h-full transform-gpu shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-slate-100 overflow-hidden relative group">
                {!isTop && isVisible && (
                  <div 
                    className="absolute inset-0 z-30 cursor-pointer bg-black/5 hover:bg-black/0 transition-colors flex items-center justify-end p-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view
                    </div>
                  </div>
                )}

                {type === 'linkedin' ? (
                  <LinkedInEmbedCard urn={post} />
                ) : (
                  <InstagramEmbedCard postUrl={post} html={post?.startsWith("<") ? post : ""} />
                )}
                
                {/* On-Card Navigation Arrows (Only on the top card) */}
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
                      aria-label="Previous Post"
                    >
                      <FaChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
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
                      aria-label="Next Post"
                    >
                      <FaChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
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

// --- Main Media Page ---

export default function Media() {
  const [mediaLinks, setMediaLinks] = useState({
    youtubeVideoId: "",
    instagramPostUrl: "",
    linkedinUrn: "",
    xPostUrl: "",
    youtubeVideoIds: [],
    instagramPostUrls: [],
    linkedinUrns: [],
    xPostUrls: [],
  });
  const [loading, setLoading] = useState(true);

  const normalizeSlots = (values, fallback = "") => {
    const rawValues = Array.isArray(values) && values.length ? values : [fallback || values];

    return rawValues
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean)
      .slice(0, 3);
  };

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
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  const youtubeVideoIds = normalizeSlots(mediaLinks.youtubeVideoIds, mediaLinks.youtubeVideoId);
  const linkedinPosts = normalizeSlots(mediaLinks.linkedinUrns, mediaLinks.linkedinUrn);
  const instagramPosts = normalizeSlots(mediaLinks.instagramPostUrls, mediaLinks.instagramPostUrl);
  const xPosts = normalizeSlots(mediaLinks.xPostUrls, mediaLinks.xPostUrl).map((url) => ({ url }));

  return (
    <div className="flex flex-col min-h-screen bg-white font-lato">
      <Navbar />

      <main className="flex-grow">
        {/* Minimal Hero */}
        <section className="bg-slate-900 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-lora font-black text-white">Media & Socials</h1>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">

          {/* YouTube Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <SocialSectionHeader
                icon={FaYoutube}
                title="Video Briefings"
                colorClass="bg-[#FF0000]"
              />
              <div className="mb-6">
                 <a href="https://www.youtube.com/channel/UCFp9m6S-MhE3mQ3rX88Y4aQ" target="_blank" rel="noopener noreferrer" className="text-sm font-lora font-black text-slate-400 hover:text-[#FF0000] uppercase tracking-widest transition-colors flex items-center gap-2 group">
                   View Channel <HiOutlineExternalLink className="group-hover:scale-110 transition-transform" />
                 </a>
              </div>
            </div>
            
            {loading ? (
              <p className="text-slate-500">Loading videos...</p>
            ) : youtubeVideoIds.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {youtubeVideoIds.map((videoId, idx) => (
                  <VideoCard
                    key={`${videoId}-${idx}`}
                    title={`Featured PPF Video ${idx + 1}`}
                    date="Latest update"
                    videoId={videoId}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm font-lato font-bold text-slate-400">
                No YouTube video link set.
              </div>
            )}
          </section>

          {/* Sticky Stacking Social Wall */}
          <section className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <StackedSocialColumn 
                title="LinkedIn Network"
                icon={FaLinkedinIn}
                colorClass="bg-[#0077B5]"
                posts={linkedinPosts}
                type="linkedin"
              />
              <StackedSocialColumn 
                title="Instagram Highlights"
                icon={FaInstagram}
                colorClass="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
                posts={instagramPosts}
                type="insta"
              />
            </div>
          </section>

          {/* X (Twitter) Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <SocialSectionHeader
                icon={FaXTwitter}
                title="X Perspectives"
                colorClass="bg-black"
              />
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
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm font-lato font-bold text-slate-400">
                No X post link set.
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
      {/* Social Scripts */}
      <Script async src="//www.instagram.com/embed.js" strategy="afterInteractive" />
      <Script async src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
    </div>
  );
}

