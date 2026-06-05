"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaPenNib, FaChevronRight, FaRunning } from "react-icons/fa";
import Link from "next/link";

export default function Activities({ sectionWidth }) {
  const [events, setEvents] = useState([]);
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, opinionsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/opinions"),
        ]);

        const eventsJson = await eventsRes.json();
        const opinionsJson = await opinionsRes.json();

        if (eventsJson.success && eventsJson.data) {
          const sortedEvents = eventsJson.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setEvents(sortedEvents.slice(0, 5));
        }
        if (opinionsJson.success && opinionsJson.data) {
          const sortedOpinions = opinionsJson.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setOpinions(sortedOpinions.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch recent engagements:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const rows = [
    {
      title: "Events & Webinars",
      icon: <FaRunning />,
      href: "/pages/activities",
      items: events,
      type: "activity",
    },
    {
      title: "Opinions",
      icon: <FaPenNib />,
      href: "/pages/opinions",
      items: opinions,
      type: "opinion",
    },
  ];

  return (
    <section id="activities" className="py-8 md:py-12 bg-slate-50">
      <div className={sectionWidth}>
        
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-6xl font-lora text-slate-900 uppercase leading-none">

              Recent <span className="text-ppf-purple">Engagement</span>
            </h2>
          </motion.div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{borderColor: '#E2E8F0', borderTopColor: '#583076', borderRightColor: '#10B981'}}></div>
            <motion.p
              className="text-slate-500 font-lato font-bold text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading Engagements...
            </motion.p>
          </div>
        )}

        {/* Bento Grid Rows */}
        {!loading && (
          <div className="space-y-10 md:space-y-16">
            {rows.map((row, idx) => (
              <div key={idx}>
                
                {/* Row Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6 border-b-2 border-slate-200 pb-2 md:pb-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-ppf-purple text-lg md:text-xl">
                      {row.icon}
                    </span>
                    <h3 className="text-sm md:text-xl font-lora font-black text-slate-800 uppercase tracking-widest">
                      {row.title}
                    </h3>
                  </div>

                  <Link
                    href={row.href}
                    className="group flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-lato font-black text-ppf-purple uppercase hover:text-ppf-purple/80 transition-colors"
                  >
                    View All
                    <FaChevronRight className="text-[8px] md:text-[10px] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Responsive Bento Grid */}
                {row.items.length > 0 ? (
                  <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[300px] md:h-[450px]">
                    
                    {row.items.map((item, i) => {
                      const gridClasses = [
                        "col-span-1 row-span-2", // Tall Card
                        "col-span-2 row-span-1", // Wide Top
                        "col-span-1 row-span-1", // Square Right Top
                        "col-span-1 row-span-1", // Square Bottom Mid
                        "col-span-2 row-span-1", // Wide Bottom Right
                      ];

                      // Get image — events use `image`, opinions use `image`
                      const imgSrc = item.image || item.img || "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80";
                      const itemTitle = item.title || item.eventTitle || "Untitled";
                      const itemDate = item.date || "";
                      const itemCategory = item.category || item.type || "";

                      const itemId = item._id || item.id || i;
                      const itemUrl = row.type === 'opinion' ? `/pages/opinions/${itemId}` : `/pages/activities/${itemId}`;

                      return (
                        <Link key={itemId} href={itemUrl} className={gridClasses[i] || ""}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative h-full w-full rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all"
                          >
                          <img
                            src={imgSrc}
                            alt={itemTitle}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent transition-opacity group-hover:opacity-80" />

                          {/* Content */}
                          <div className="absolute inset-0 p-2 md:p-4 flex flex-col justify-end">
                            <div className="space-y-0.5 md:space-y-1">
                              {itemCategory && (
                                <span className="inline-block bg-ppf-purple text-white text-[6px] md:text-[8px] font-lato font-black px-1.5 md:px-2 py-0.5 rounded-full uppercase">
                                  {itemCategory}
                                </span>
                              )}
                              <p className="hidden md:block text-[9px] font-lato font-bold text-slate-300 uppercase tracking-widest">
                                {itemDate}
                              </p>
                              <h4 className={`font-lora font-extrabold text-white leading-tight group-hover:text-ppf-orange transition-colors line-clamp-2 ${i === 0 ? 'text-[10px] md:text-xl' : 'text-[8px] md:text-sm'}`}>
                                {itemTitle}
                              </h4>
                            </div>

                            {/* Hover Action */}
                            <div className="mt-1 hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                              <span className="text-[9px] font-lato font-black uppercase text-white tracking-widest">
                                Explore
                              </span>
                              <FaArrowRight className="text-white text-[10px]" />
                            </div>
                          </div>
                        </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 font-lato text-sm">
                    No {row.title.toLowerCase()} available yet.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}