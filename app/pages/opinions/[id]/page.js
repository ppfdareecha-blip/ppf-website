"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import opinionsData from "@/data/Opinions.json";
import Link from "next/link";
import { FaRegCalendarAlt, FaUser, FaChevronLeft, FaTwitter, FaLinkedin, FaFacebook, FaDownload } from "react-icons/fa";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const stripHtml = (htmlString) => {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>/g, "");
};

export default function OpinionDetail() {
  const { id } = useParams();
  const [opinion, setOpinion] = useState(null);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [otherOpinions, setOtherOpinions] = useState(() => {
    return opinionsData.filter((o) => o.id !== id).slice(0, 3);
  });
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsNavHidden(true);
    } else {
      setIsNavHidden(false);
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = opinionsData.find((o) => o.id === id);
    if (found) {
      setOpinion({
        ...found,
        downloadableLink: found.downloadableLink || found.downloadLink || ""
      });
    }

    fetch("/api/opinions")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const dbItem = json.data.find((o) => o._id === id || o.id === id);
          if (dbItem) {
            const cleanContent = stripHtml(dbItem.content);
            setOpinion({
              id: dbItem._id,
              title: dbItem.title,
              author: dbItem.author,
              authorPosition: dbItem.authorPosition || "",
              authorImage: dbItem.authorImage || "",
              authors: dbItem.authors || [],
              date: dbItem.date,
              category: dbItem.category,
              image: dbItem.image || "/pictures/opinionMockup.jpg",
              excerpt: cleanContent ? cleanContent.substring(0, 150) + "..." : "",
              content: dbItem.content,
              centerTag: dbItem.centerTag,
              downloadableLink: dbItem.downloadableLink || "",
            });
          }

          const mappedDbOpinions = json.data.map((dbItem) => {
            const cleanContent = stripHtml(dbItem.content);
            return {
              id: dbItem.id || dbItem._id,
              title: dbItem.title,
              author: dbItem.author,
              authorPosition: dbItem.authorPosition || "",
              authorImage: dbItem.authorImage || "",
              authors: dbItem.authors || [],
              date: dbItem.date,
              category: dbItem.category,
              image: dbItem.image || "/pictures/opinionMockup.jpg",
              excerpt: cleanContent ? cleanContent.substring(0, 150) + "..." : "",
              content: dbItem.content,
              centerTag: dbItem.centerTag,
            };
          });

          const filtered = mappedDbOpinions.filter((o) => o.id !== id);
          setOtherOpinions(filtered.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Error fetching dynamic opinions", err);
      });
  }, [id]);

  if (!opinion) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-ppf-purple rounded-full animate-spin" />
        <span className="font-lato text-xs font-bold uppercase tracking-[0.2em] text-slate-500 animate-pulse text-center">
          Loading Insight...
        </span>
      </div>
    );
  }

  const resolvedAuthors =
    opinion.authors && opinion.authors.length > 0
      ? opinion.authors
      : [
          {
            name: opinion.author || "PPF Expert",
            position: opinion.authorPosition || "",
            image: opinion.authorImage || "",
          },
        ];

  return (
    <div className="bg-white min-h-screen text-slate-800 font-lora selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden antialiased">
      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={isNavHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100] shadow-sm"
      >
        <Navbar />
      </motion.div>

      <main className="pt-28 md:pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Action Header / Breadcrumb */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/pages/opinions"
              className="group inline-flex items-center gap-3 text-xs font-lato font-bold text-ppf-purple uppercase tracking-widest hover:text-ppf-orange transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-ppf-purple group-hover:border-ppf-purple group-hover:text-white transition-all duration-200 shadow-sm">
                <FaChevronLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Library
            </Link>
          </div>

          <header className="mb-10">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-lora font-black text-slate-900 leading-[1.2] mb-8 tracking-tight break-words">
              {opinion.title}
            </h1>

            {/* Meta Row: Authors & Sharing Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-y border-slate-100 py-6 my-6">
              
              {/* Authors Grid */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {resolvedAuthors.map((auth, idx) => {
                    const CardContent = () => (
                      <>
                        {auth.image ? (
                          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                            <img src={auth.image} alt={auth.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-ppf-purple flex items-center justify-center text-white shadow-md flex-shrink-0">
                            <FaUser size={14} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-lato font-bold text-slate-900 truncate group-hover:text-ppf-purple transition-colors">{auth.name}</p>
                          {auth.position && (
                            <p className="text-[10px] font-lato font-extrabold text-teal-600 uppercase tracking-wider truncate mt-0.5">
                              {auth.position}
                            </p>
                          )}
                        </div>
                      </>
                    );

                    return auth.id ? (
                      <Link 
                        key={idx} 
                        href={`/pages/authors/${auth.id}`}
                        className="group flex items-center gap-3.5 bg-slate-50/60 p-2 pr-4 rounded-2xl border border-slate-100 hover:border-ppf-purple/30 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <CardContent />
                      </Link>
                    ) : (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3.5 bg-slate-50/60 p-2 pr-4 rounded-2xl border border-slate-100"
                      >
                        <CardContent />
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Date Block */}
                <div className="flex items-center gap-2 text-sm font-lato font-medium text-slate-500 lg:border-l lg:border-slate-200 lg:pl-6 h-full py-1">
                  <FaRegCalendarAlt className="text-ppf-orange shrink-0" size={14} />
                  <span>{opinion.date}</span>
                </div>
              </div>

              {/* Social Actions & Download */}
              <div className="flex items-center gap-4 flex-wrap bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-2xl justify-between sm:justify-start">
                {opinion.downloadableLink && (
                  <a
                    href={opinion.downloadableLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white bg-ppf-purple hover:bg-ppf-orange active:scale-95 transition-all text-xs font-lato font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-md hover:shadow-lg border border-slate-200/20 mr-2"
                  >
                    <FaDownload size={11} /> Download PDF
                  </a>
                )}
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-lato font-bold text-slate-400 uppercase tracking-widest">Share Article:</span>
                  <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-xl bg-white lg:bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white hover:scale-105 transition-all shadow-sm border border-slate-100"><FaTwitter size={14} /></button>
                    <button className="w-9 h-9 rounded-xl bg-white lg:bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-700 hover:text-white hover:scale-105 transition-all shadow-sm border border-slate-100"><FaLinkedin size={14} /></button>
                    <button className="w-9 h-9 rounded-xl bg-white lg:bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:scale-105 transition-all shadow-sm border border-slate-100"><FaFacebook size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Feature Image Canvas */}
          <div className="relative w-full aspect-[16/10] md:aspect-[21/10] rounded-3xl overflow-hidden shadow-xl border border-slate-100 group mb-14 bg-slate-100">
            <img
              src={opinion.image}
              alt={opinion.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex flex-wrap gap-2 z-10">
              <span className="inline-block text-ppf-orange bg-white/95 backdrop-blur-md text-[10px] font-lato font-extrabold px-4 py-2 rounded-xl uppercase tracking-[0.15em] shadow-sm">
                {opinion.category}
              </span>
              {opinion.centerTag && (
                <span className="inline-block text-white bg-ppf-purple/95 backdrop-blur-md text-[10px] font-lato font-extrabold px-4 py-2 rounded-xl uppercase tracking-[0.15em] shadow-sm">
                  {opinion.centerTag}
                </span>
              )}
            </div>
          </div>

          {/* Core Structured Article Canvas */}
          <article className="prose prose-slate max-w-3xl mx-auto break-words w-full overflow-hidden">
            {opinion.excerpt && (
              <p 
                className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium leading-relaxed italic mb-12 border-l-4 border-ppf-purple pl-5 sm:pl-6 break-words bg-purple-50/30 py-3 pr-4 rounded-r-2xl"
                dangerouslySetInnerHTML={{ __html: opinion.excerpt }}
              />
            )}

            {opinion.content && (
              <>
                <div
                  className="opinion-detail-content text-slate-700 font-lato leading-relaxed text-base sm:text-lg max-w-full overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: opinion.content }}
                />
                <style>{`
                  .opinion-detail-content {
                    word-wrap: break-word;
                    word-break: break-word;
                    overflow-wrap: break-word;
                  }
                  .opinion-detail-content h1 { font-size: 2rem; font-weight: 800; margin: 2.5rem 0 1.25rem; color: #0f172a; line-height: 1.25; font-family: inherit; }
                  .opinion-detail-content h2 { font-size: 1.6rem; font-weight: 700; margin: 2.25rem 0 1rem; color: #1e293b; font-family: inherit; }
                  .opinion-detail-content h3 { font-size: 1.35rem; font-weight: 700; margin: 1.75rem 0 0.75rem; color: #334155; }
                  .opinion-detail-content p { margin: 1.25rem 0; line-height: 1.85; color: #334155; }
                  .opinion-detail-content strong { font-weight: 700; color: #0f172a; }
                  .opinion-detail-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 1.25rem 0; }
                  .opinion-detail-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1.25rem 0; }
                  .opinion-detail-content li { margin: 0.5rem 0; line-height: 1.8; }
                  .opinion-detail-content blockquote { border-left: 4px solid #7c3aed; margin: 2rem 0; padding: 1rem 1.25rem; color: #475569; font-style: italic; background: #fdfcff; border-radius: 0 1rem 1rem 0; }
                  
                  .opinion-detail-content table { 
                    display: block;
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    border-collapse: collapse; 
                    margin: 2rem 0; 
                    font-size: 0.95rem; 
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                  }
                  .opinion-detail-content table thead { background: #7c3aed; color: white; }
                  .opinion-detail-content table td, .opinion-detail-content table th { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; min-width: 140px; }
                  .opinion-detail-content table th { font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
                  .opinion-detail-content table tbody tr:nth-child(even) { background: #f8fafc; }
                  
                  .opinion-detail-content img { max-width: 100%; height: auto; border-radius: 16px; margin: 2rem 0; shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05); }
                  .opinion-detail-content a { color: #7c3aed; text-decoration: underline; text-underline-offset: 4px; font-weight: 600; }
                  .opinion-detail-content a:hover { color: #5b21b6; }
                `}</style>
              </>
            )}
          </article>
        </div>

        {/* Tail Discovery Module / Recommendation Loop */}
        <section className="bg-slate-50 border-t border-slate-100 py-20 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-lora font-black uppercase tracking-tight text-slate-900">
                Read More Insights
              </h2>
              <Link 
                href="/pages/opinions" 
                className="text-xs font-lato font-bold text-ppf-purple uppercase tracking-widest hover:text-ppf-orange transition-colors duration-200 group flex items-center gap-1.5"
              >
                View All Opinions
                <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {otherOpinions.map((other) => (
                <Link 
                  key={other.id} 
                  href={`/pages/opinions/${other.id}`} 
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden h-full"
                >
                  <div className="relative aspect-[21/10] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img 
                      src={other.image} 
                      alt={other.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out" 
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-base font-lora font-bold text-slate-900 mb-3 group-hover:text-ppf-purple transition-colors duration-200 line-clamp-2 leading-snug">
                      {other.title}
                    </h4>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                      <span className="text-[10px] font-lato font-extrabold text-slate-400 uppercase tracking-widest truncate max-w-[80%]">
                        {other.author}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-ppf-purple transition-colors duration-200 shrink-0">
                        <FaChevronLeft className="rotate-180" size={8} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}