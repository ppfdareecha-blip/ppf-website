"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import eventsData from "@/data/Events.json";
import Link from "next/link";
import { FaRegCalendarAlt, FaChevronLeft, FaMapMarkerAlt } from "react-icons/fa";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isNavHidden, setIsNavHidden] = useState(false);
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
    const fetchEvent = async () => {
      try {
        const res = await fetch('/api/admin/events');
        const json = await res.json();
        if (json.success && json.data) {
          const dbEvent = json.data.find(e => e._id === id);
          if (dbEvent) {
            setEvent({
              id: dbEvent._id,
              title: dbEvent.title,
              date: dbEvent.date,
              time: `${dbEvent.fromTime} - ${dbEvent.endTime || ''}`,
              location: dbEvent.venue,
              type: 'Event',
              image: dbEvent.eventPoster || '/images/events/event1.jpg',
              summary: dbEvent.about ? (dbEvent.about.substring(0, 150) + '...') : '',
              about: dbEvent.about || '',
              speaker: Array.isArray(dbEvent.speakers) && dbEvent.speakers.length > 0 ? dbEvent.speakers[0] : '',
              centerTag: dbEvent.center || '',
              mode: dbEvent.mode || '',
              pdfLink: dbEvent.pdfLink || '',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-400 font-black uppercase tracking-widest">
        Loading Event...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-slate-800 font-lora selection:bg-ppf-purple selection:text-white flex flex-col">
      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={isNavHidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <Navbar />
      </motion.div>

      <main className="pt-24 md:pt-32 pb-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Back */}
          <div className="mb-10">
            <Link href="/pages/activities" className="group inline-flex items-center gap-2 text-xs font-lato font-black text-ppf-purple uppercase tracking-widest hover:text-ppf-orange transition-colors">
              <div className="w-8 h-8 rounded-full border border-ppf-teal flex items-center justify-center group-hover:bg-ppf-teal group-hover:text-white transition-all">
                <FaChevronLeft size={10} />
              </div>
              Back to Activities
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* LHS: Image (Sticky) */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
                  
                  <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2">
                    <div className="inline-block text-ppf-purple bg-white backdrop-blur-md border border-white/20 text-[10px] font-lato font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                      {event.type}
                    </div>
                    {event.centerTag && (
                      <div className="inline-block text-white bg-ppf-purple/90 backdrop-blur-md border border-white/20 text-[10px] font-lato font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                        {event.centerTag}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RHS: Content */}
            <div className="lg:col-span-7 flex flex-col pt-4 lg:pt-0">
              <header className="mb-12">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-lora font-black text-slate-900 leading-[1.15] mb-8 tracking-tighter line-clamp-3">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-lora font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-8">
                  <span className="flex items-center gap-2"><FaRegCalendarAlt className="text-ppf-orange" size={16} /> {event.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-ppf-teal" size={16} /> {event.location}</span>
                </div>
                {event.pdfLink && (
                  <div className="mt-8">
                    <a
                      href={event.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-ppf-purple hover:bg-ppf-purple/90 text-white font-lato font-black text-sm tracking-widest uppercase py-4 px-8 rounded-2xl transition-all shadow-xl shadow-ppf-purple/20 group"
                    >
                      Download PDF
                      <svg className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                )}
              </header>

              <article className="prose prose-slate prose-lg max-w-none">
                <p className="text-xl md:text-2xl text-slate-700 font-futura font-medium leading-relaxed italic mb-10 border-l-4 border-ppf-purple pl-6">
                  {event.summary}
                </p>
                <div className="text-slate-800 font-lato leading-relaxed text-lg space-y-8">
                  <div className="whitespace-pre-wrap">
                    {event.about}
                  </div>
                  
                  {/* Event Details Card */}
                  <div className="mt-20 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ppf-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <h3 className="text-2xl font-lora font-black text-slate-900 uppercase tracking-tight mb-8">Event Briefing</h3>
                    <ul className="space-y-8 text-sm font-lato">
                      <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                          <FaRegCalendarAlt className="text-ppf-orange" size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="block font-black text-slate-900 uppercase tracking-widest text-[10px] mb-1">Date & Time</span>
                          <span className="text-slate-700 font-medium text-base">{event.date} {event.time ? `• ${event.time}` : ''}</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                          <FaMapMarkerAlt className="text-ppf-teal" size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="block font-black text-slate-900 uppercase tracking-widest text-[10px] mb-1">Location</span>
                          <span className="text-slate-700 font-medium text-base">{event.location}</span>
                        </div>
                      </li>
                      {event.speaker && (
                        <li className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                            <svg className="w-4 h-4 text-ppf-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="block font-black text-slate-900 uppercase tracking-widest text-[10px] mb-1">Speaker</span>
                            <span className="text-slate-700 font-medium text-base">{event.speaker}</span>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
