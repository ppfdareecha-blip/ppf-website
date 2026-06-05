"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaRegCalendarAlt, FaChevronRight, FaPen, FaTimes, FaCamera } from "react-icons/fa";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import opinionsData from "@/data/Opinions.json";
import OpinionCard from "@/components/opinions/OpinionCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper utility to safely strip HTML tags from raw content for plain-text excerpts
const stripHtml = (htmlString) => {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>/g, "");
};

function OpinionsContent() {
  const containerRef = useRef(null);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [formData, setFormData] = useState({ fullName: "", email: "", title: "", analysis: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for raw data and loading sequences
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCenter, setSelectedCenter] = useState("All");
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsNavHidden(true);
    } else {
      setIsNavHidden(false);
    }
  });

  // Fetch data from database on mount
  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        const res = await fetch("/api/opinions");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const mapped = json.data.map(op => {
            const cleanContent = stripHtml(op.content);
            return {
              id: op._id,
              category: op.category || "Opinion",
              date: op.date,
              title: op.title,
              excerpt: cleanContent ? cleanContent.substring(0, 100) + "..." : "",
              author: op.author,
              image: op.image || "/pictures/opinionMockup.jpg",
              centerTag: op.centerTag || ""
            };
          });
          setOpinions(mapped);
        } else {
          setOpinions(opinionsData);
        }
      } catch (e) {
        console.error("Failed to fetch opinions, using local fallback", e);
        setOpinions(opinionsData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOpinions();
  }, []);

  // Fire animations when loading completes OR when filter states change
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
      });

      // Clear existing scroll triggers to prevent memory leaks during rapid filtering mutations
      ScrollTrigger.getAll().forEach(t => t.kill());

      gsap.from(".opinion-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".opinions-list",
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, selectedCategory, selectedCenter]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.title || !formData.analysis) {
      return alert("Please fill the required fields.");
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/opinions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.fullName,
          email: formData.email,
          content: formData.analysis,
          imageBase64: imageBase64
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Opinion submitted successfully! It will be reviewed by our editors.");
        setIsModalOpen(false);
        setFormData({ fullName: "", email: "", title: "", analysis: "" });
        setSelectedFile(null);
        setImageBase64("");
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate unique filter options dynamically based on available items
  const uniqueCategories = ["All", ...new Set(opinions.map(op => op.category).filter(Boolean))];
  const uniqueCenters = ["All", ...new Set(opinions.map(op => op.centerTag).filter(Boolean))];

  // Apply filtered state computations across raw source collection array
  const filteredOpinions = opinions.filter(op => {
    const matchesCategory = selectedCategory === "All" || op.category === selectedCategory;
    const matchesCenter = selectedCenter === "All" || op.centerTag === selectedCenter;
    return matchesCategory && matchesCenter;
  });

  // Render Premium Loader if state data is fetching
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-ppf-purple rounded-full animate-spin" />
        <span className="font-lato text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Loading Library...
        </span>
      </div>
    );
  }

  // Derive contextual slicing models out of computed collection pipelines
  const recentOpinion = filteredOpinions.length > 0 ? filteredOpinions[0] : null;
  const featuredOpinions = filteredOpinions.slice(1, 4);
  const remainingOpinions = filteredOpinions.slice(4);

  return (
    <div ref={containerRef} className="bg-white min-h-screen text-slate-800 font-sans selection:bg-ppf-purple/20 selection:text-ppf-purple">
      <main className="pt-36 md:pt-40">

        {/* Page Header */}
        <section className="border-b border-slate-100 pb-8 mb-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="hero-content flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-3">
                <h1 className="text-3xl md:text-5xl font-lora font-black text-mono-deep uppercase tracking-tighter shrink-0">
                  Opinions
                </h1>
                
                {/* Dynamic Selection Dropdown Controls */}
                <div className="flex flex-wrap items-center gap-3 w-full">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-lato font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Type</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-lato font-bold text-slate-700 focus:outline-none focus:border-ppf-purple/40 min-w-[140px] cursor-pointer"
                    >
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] font-lato font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Opinion Center</label>
                    <select
                      value={selectedCenter}
                      onChange={(e) => setSelectedCenter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-lato font-bold text-slate-700 focus:outline-none focus:border-ppf-purple/40 min-w-[160px] cursor-pointer"
                    >
                      {uniqueCenters.map(center => (
                        <option key={center} value={center}>{center === "All" ? "All Centers" : center}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <p className="font-lato text-slate-500 max-w-2xl text-base font-medium leading-relaxed">
                Insightful analysis and strategic perspectives on India&apos;s evolving policy landscape,
                authored by experts and practitioners.
              </p>
            </div>
            <div className="hero-content shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-ppf-purple text-white font-lato font-black px-6 py-3.5 rounded-2xl uppercase tracking-widest text-xs hover:bg-ppf-purple/90 transition-all shadow-lg hover:shadow-ppf-purple/20 group"
              >
                <FaPen className="text-[10px] group-hover:rotate-12 transition-transform" />
                Write Your Own Opinion
              </button>
            </div>
          </div>
        </section>

        {/* Conditional rendering wrapper block if targeted query intersection falls completely short */}
        {filteredOpinions.length === 0 ? (
          <section className="max-w-7xl mx-auto px-6 py-24 text-center hero-content">
            <div className="max-w-md mx-auto bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h3 className="text-xl font-lora font-black text-slate-800 mb-2">No Matching Insights</h3>
              <p className="text-sm font-lato text-slate-500 mb-6"> We couldn&apos;t find any opinions matching your exact filter selection settings.</p>
              <button 
                onClick={() => { setSelectedCategory("All"); setSelectedCenter("All"); }}
                className="bg-ppf-purple text-white font-lato font-black text-[10px] tracking-widest uppercase px-6 py-3 rounded-xl hover:bg-ppf-purple/90 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Featured & Recent Opinions */}
            <section className="max-w-7xl mx-auto px-6 mb-16 hero-content">
              <div className="grid lg:grid-cols-12 gap-12">
                {recentOpinion && (
                  <div className={featuredOpinions.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
                    <Link href={`/pages/opinions/${recentOpinion.id}`} className="group block h-full">
                      <div className="relative h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
                        <Image
                          src={recentOpinion.image}
                          alt={recentOpinion.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 66vw"
                          className="object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                          <div className="flex items-center gap-4 text-[9px] font-lato font-black text-white/70 uppercase tracking-widest mb-3">
                            <span className="flex items-center gap-2 font-bold"><FaRegCalendarAlt /> {recentOpinion.date}</span>
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                            <span className="text-ppf-purple font-bold">{recentOpinion.category}</span>
                          </div>
                          <h2 className="text-2xl md:text-4xl font-lora font-black text-white leading-[1.1] mb-4 group-hover:text-ppf-lilac transition-colors duration-300">
                            {recentOpinion.title}
                          </h2>
                          <p 
                            className="text-white/80 font-lato text-sm leading-relaxed line-clamp-2 max-w-2xl mb-6"
                            dangerouslySetInnerHTML={{ __html: recentOpinion.excerpt }}
                          />
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex flex-col">
                              <span className="text-[8px] text-white/50 font-lato font-bold uppercase tracking-[0.2em] mb-0.5">Author</span>
                              <span className="text-sm font-lato font-black text-white">{recentOpinion.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white font-lora font-black text-xs">
                              READ ARTICLE <FaChevronRight className="text-ppf-teal" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-8 left-8">
                          <span className="bg-ppf-purple text-white text-[10px] font-lora font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                            LATEST INSIGHT
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {featuredOpinions.length > 0 && (
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <h3 className="text-xs font-lora font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-slate-200"></span> FEATURED OPINIONS
                    </h3>
                    <div className="flex flex-col gap-6">
                      {featuredOpinions.map((opinion) => (
                        <Link key={opinion.id} href={`/pages/opinions/${opinion.id}`} className="group">
                          <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-ppf-orange/30 transition-all duration-300">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                              <Image
                                src={opinion.image}
                                alt={opinion.title}
                                fill
                                sizes="100px"
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-lora font-black text-ppf-purple uppercase tracking-widest">{opinion.category}</span>
                              <h4 className="text-[13px] font-lora font-black text-slate-900 leading-tight line-clamp-2 group-hover:text-ppf-purple transition-colors">
                                {opinion.title}
                              </h4>
                              <span className="text-[8px] font-lato text-slate-400 font-bold">{opinion.date}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* All Opinions Grid */}
            {remainingOpinions.length > 0 && (
              <section className="max-w-7xl mx-auto px-6 mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-lora font-black text-slate-900 uppercase tracking-tight">Recent Insights</h3>
                </div>

                <div className="opinions-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {remainingOpinions.map((opinion) => (
                    <OpinionCard key={opinion.id} item={opinion} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Archives / Institutional Section */}
        <section className="bg-ppf-purple text-white py-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-lora font-black uppercase mb-6 max-w-4xl">
              Contributing to India&apos;s <span className="text-slate-200 underline decoration-ppf-orange decoration-4 underline-offset-8">Policy Dialogue</span>
            </h2>
            <p className="text-white/80 font-lato text-lg font-medium max-w-2xl mb-8">
              Our publications aim to foster evidence-based discussions and provide strategic clarity for decision-makers.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 w-full max-w-xl">
              <button className="bg-white text-ppf-purple font-lato font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors shadow-2xl">
                Browse Archives
              </button>
              <button className="bg-transparent border border-white/20 text-white font-lato font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                Submission Guidelines
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsModalOpen(false); setSelectedFile(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-3xl overflow-y-auto max-h-[90vh] border border-slate-100 
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-slate-50
              [&::-webkit-scrollbar-track]:rounded-r-[2.5rem]
              [&::-webkit-scrollbar-thumb]:bg-slate-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-ppf-purple/30"
            >
              <div className="p-8 md:p-12">
                <button
                  onClick={() => { setIsModalOpen(false); setSelectedFile(null); }}
                  className="absolute top-8 right-8 text-slate-400 hover:text-ppf-purple transition-colors z-10"
                >
                  <FaTimes size={24} />
                </button>

                <h2 className="text-3xl font-lora font-black text-ppf-purple uppercase tracking-tighter mb-2">
                  Share Your Perspective
                </h2>
                <p className="font-lato text-slate-500 mb-8 text-sm font-medium">
                  Submit your analysis for review by our editorial team.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-lato font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ppf-purple/30 transition-colors font-lato" placeholder="John Doe" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-lato font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ppf-purple/30 transition-colors font-lato" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-lato font-black text-slate-400 uppercase tracking-widest ml-1">Opinion Title</label>
                    <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ppf-purple/30 transition-colors font-lato" placeholder="The future of digital infrastructure..." />
                  </div>

                  {/* Image Attachment Section */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-lato font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image / Attachment</label>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-6 px-4 cursor-pointer hover:border-ppf-purple/30 hover:bg-slate-100 transition-all group"
                      >
                        <FaCamera className="text-slate-300 group-hover:text-ppf-purple transition-colors mb-2" size={20} />
                        <span className="text-xs font-lato font-bold text-slate-500 group-hover:text-ppf-purple transition-colors text-center px-4 line-clamp-1">
                          {selectedFile ? selectedFile : "Click to upload an image"}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-lato">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-lato font-black text-slate-400 uppercase tracking-widest ml-1">Your Analysis</label>
                    <textarea required rows={4} value={formData.analysis} onChange={(e) => setFormData({...formData, analysis: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-ppf-purple/30 transition-colors font-lato resize-none" placeholder="Write your thoughts here..."></textarea>
                  </div>

                  <button disabled={isSubmitting} type="submit" className="w-full bg-ppf-purple text-white font-lato font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-ppf-purple/90 transition-all shadow-xl mt-4 disabled:opacity-50">
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OpinionsContent;