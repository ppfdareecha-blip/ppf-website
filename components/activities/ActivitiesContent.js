"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaRegCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "@/components/activities/EventCard";
import EventModal from "@/components/activities/EventModal";
// import eventsData removed – we will use only DB data
import { useCallback } from "react";
import { PREDEFINED_CENTERS } from "@/components/admin/constants";

const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const months = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUNE: 5,
      JUL: 6, JULY: 6, AUG: 7, SEP: 8, SEPT: 8, OCT: 9, NOV: 10, DEC: 11
    };
    const month = months[parts[1].toUpperCase()];
    if (month !== undefined) return new Date(parseInt(parts[2]), month, parseInt(parts[0]));
  }
  return new Date(0);
};

const sortAsc = (items) => [...items].sort((a, b) => parseDate(a.date) - parseDate(b.date));
const sortDesc = (items) => [...items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState("all");
  const [isCenterFilterOpen, setIsCenterFilterOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef(null);
  const centerFilterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (centerFilterRef.current && !centerFilterRef.current.contains(event.target)) {
        setIsCenterFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/events");
        const json = await res.json();
        if (json.success && json.data) {
          // Map DB events to the structure used by the frontend
          const mapped = json.data.map(e => ({
            id: e._id,
            title: e.title,
            date: e.date,
            time: `${e.fromTime} - ${e.endTime || ""}`,
            location: e.venue,
            type: "Event",
            image: e.eventPoster || "/images/events/event1.jpg",
            summary: e.about ? (e.about.substring(0, 150) + "...") : "",
            about: e.about || "",
            speaker: Array.isArray(e.speakers) && e.speakers.length > 0 ? e.speakers[0] : "",
            centerTag: e.center || "",
            mode: e.mode || "",
            pdfLink: e.pdfLink || "",
            status: new Date(e.date) > new Date() ? "upcoming" : "past"
          }));
          // Combine with JSON data, avoiding duplicates
          setEvents(sortDesc(mapped));
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const eventsPerPage = 12;
  const allUpcomingEvents = (() => { const up = sortDesc(events.filter(e => e.status === "upcoming")); return up.length ? up : sortDesc(events); })();
  const allPastEvents = sortDesc(events.filter((event) => event.status === "past"));
  let rawList = activeTab === "upcoming" ? allUpcomingEvents.slice(0, 3) : allPastEvents;

  const foundationYear = 2005;
  const currentYear = Math.max(2026, new Date().getFullYear() + 1);
  const filterYears = [];
  for (let year = currentYear; year >= foundationYear; year--) {
    filterYears.push(year.toString());
  }

  if (dateRange !== "all") {
    rawList = rawList.filter((e) => e.date.includes(dateRange));
  }

  if (selectedCenter !== "all") {
    rawList = rawList.filter((e) => e.centerTag === selectedCenter);
  }

  const totalPages = Math.ceil(rawList.length / eventsPerPage);

  // Data slicing for the featured "Dashboard" layout
  const isFeaturedView = activeTab === "upcoming" && currentPage === 1 && dateRange === "all";

  const latestEvent = isFeaturedView ? allUpcomingEvents[0] : null;
  const recentPastEvents = isFeaturedView ? allPastEvents.slice(0, 3) : [];
  const gridEvents = isFeaturedView ? allPastEvents.slice(3, 12) : rawList.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  // Note: currentEvents is only used for pagination-based grid views
  const currentEvents = rawList.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const getVisiblePages = () => {
    const maxVisiblePages = 9;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const halfWindow = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - halfWindow;
    let endPage = currentPage + halfWindow;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxVisiblePages + 1;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/pages/activities?${params.toString()}`, { scroll: false });
  };

  const openEventModal = (event) => setSelectedEvent(event);
  const closeEventModal = () => setSelectedEvent(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "upcoming" || tab === "past")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = selectedEvent ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <section className="w-full bg-[#FFFFFF] pt-10 pb-6 md:pt-12 md:pb-8 text-center border-b border-gray-100">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-lora font-extrabold text-[#1a0b33] uppercase">
            Events & <span className="text-ppf-purple font-black">Activities</span>
          </h1>
        </div>
      </section>

      <section className="w-full border-b border-gray-200 sticky top-20 z-30 bg-white shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center py-2">
          <div className="flex space-x-6 md:space-x-12 px-4 mb-4 md:mb-0 w-full md:w-auto overflow-x-auto whitespace-nowrap" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <button
              onClick={() => handleTabChange("upcoming")}
              className={`py-3 px-2 font-lato font-bold text-sm tracking-widest uppercase transition-colors flex-shrink-0 ${activeTab === "upcoming"
                  ? "text-ppf-purple border-b-[3px] border-ppf-purple"
                  : "text-slate-600 hover:text-ppf-purple"
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleTabChange("past")}
              className={`py-3 px-2 font-lato font-bold text-sm tracking-widest uppercase transition-colors flex-shrink-0 ${activeTab === "past"
                  ? "text-ppf-purple border-b-[3px] border-ppf-purple"
                  : "text-slate-600 hover:text-ppf-purple"
                }`}
            >
              Past
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto px-4 md:px-0 mt-4 md:mt-0">
            {/* Center Filter */}
            <div ref={centerFilterRef} className="relative w-full md:w-auto">
              <button
                onClick={() => setIsCenterFilterOpen(!isCenterFilterOpen)}
                className="flex items-center bg-white rounded-lg px-4 py-2.5 border-2 border-slate-200 text-sm font-lato font-bold text-slate-800 focus:outline-none cursor-pointer w-full md:w-56 justify-between shadow-sm hover:border-ppf-purple hover:shadow-md transition-all group"
              >
                <span className="text-slate-500 group-hover:text-ppf-purple transition-colors truncate mr-2">
                  {selectedCenter === "all" ? "Filter by Center" : selectedCenter}
                </span>
                <span className="bg-ppf-purple/10 text-ppf-purple text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0">ALL</span>
              </button>
              {isCenterFilterOpen && (
                <div className="absolute right-0 mt-3 w-full sm:w-72 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCenter("all");
                      setIsCenterFilterOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    All Centers
                  </button>
                  {PREDEFINED_CENTERS.map((center) => (
                    <button
                      key={center}
                      onClick={() => {
                        setSelectedCenter(center);
                        setIsCenterFilterOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-ppf-purple transition-colors"
                    >
                      {center}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Filter */}
            <div ref={filterRef} className="relative w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center bg-white rounded-lg px-4 py-2.5 border-2 border-slate-200 text-sm font-lato font-bold text-slate-800 focus:outline-none cursor-pointer w-full md:w-56 justify-between shadow-sm hover:border-ppf-purple hover:shadow-md transition-all group"
              >
                <span className="text-slate-500 group-hover:text-ppf-purple transition-colors">Filter by Year</span>
                <span className="bg-ppf-purple/10 text-ppf-purple text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{dateRange}</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      setDateRange("all");
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    All Years
                  </button>
                  {filterYears.slice(0, 10).map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setDateRange(year);
                        setIsFilterOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-ppf-purple transition-colors"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-7xl py-6 md:py-8">

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{borderColor: '#E2E8F0', borderTopColor: '#583076', borderRightColor: '#10B981'}}></div>
            <motion.p
              className="text-slate-600 font-lato font-bold text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading Events...
            </motion.p>
          </div>
        )}

        {/* Featured Dashboard for Upcoming tab */}
        {!loading && isFeaturedView && latestEvent && (
          <div className="mb-16">
            <div className="grid lg:grid-cols-12 gap-10">
              {/* LHS: Latest Upcoming (Large) */}
              <div className="lg:col-span-8">
                <div
                  onClick={() => openEventModal(latestEvent)}
                  className="group cursor-pointer block h-full"
                >
                  <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
                    <Image
                      src={latestEvent.image}
                      alt={latestEvent.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    <div className="absolute top-6 left-8">
                      <span className="bg-ppf-purple text-white text-[9px] font-lora font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/20">
                        Upcoming
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                      <div className="flex items-center gap-3 text-[10px] font-lato font-black text-white/70 uppercase tracking-widest mb-3">
                        <span className="flex items-center gap-2 text-white/90 font-bold"><FaRegCalendarAlt className="text-ppf-orange" /> {latestEvent.date}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-2 text-white/90 font-bold">
                          <FaLocationDot className="text-ppf-teal" /> {latestEvent.location}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-3xl font-lora font-black text-white leading-[1.15] mb-4 group-hover:text-ppf-lilac transition-colors duration-300 tracking-tighter line-clamp-3">
                        {latestEvent.title}
                      </h2>
                      <p className="text-white/70 font-lato text-sm leading-relaxed line-clamp-2 max-w-2xl mb-8 font-medium">
                        {latestEvent.summary}
                      </p>
                      <div className="flex items-center justify-between pt-5 border-t border-white/10">
                        <span className="bg-white/10 hover:bg-white/20 text-white text-[9px] font-lora font-black px-6 py-3 rounded-full uppercase tracking-widest transition-colors backdrop-blur-md border border-white/10 flex items-center gap-2">
                          View Details <FaChevronRight size={8} className="text-ppf-teal" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RHS: Recent Accomplishments (Past Events) */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-6 bg-ppf-teal"></div>
                  <h3 className="text-[10px] font-lora font-black text-slate-400 uppercase tracking-[0.2em]">Recently Concluded</h3>
                </div>
                <div className="flex flex-col gap-5">
                  {recentPastEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => openEventModal(event)}
                      className="group cursor-pointer"
                    >
                      <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-ppf-orange hover:bg-white transition-all duration-500">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md border border-slate-200">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            sizes="100px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[8px] font-lora font-black text-ppf-purple uppercase tracking-widest leading-none">
                            PAST ENGAGEMENT
                          </div>
                          <h4 className="text-[12px] font-lora font-black text-slate-900 leading-[1.2] line-clamp-2 group-hover:text-ppf-purple transition-colors">
                            {event.title}
                          </h4>
                          <span className="text-[9px] font-lato text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            {event.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {gridEvents.length > 0 && (
              <div className="mt-16 pt-12 border-t border-slate-100">
                <h3 className="text-xl font-lora font-black text-slate-900 uppercase tracking-tight mb-10">Recently Concluded Engagements</h3>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {gridEvents.map((event) => (
                    <EventCard key={event.id} item={event} onClick={openEventModal} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Standard Grid Layout */}
        {!loading && !isFeaturedView && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentEvents.map((event) => (
              <EventCard key={event.id} item={event} onClick={openEventModal} />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3 flex-wrap">
            {totalPages > 9 && (
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="min-w-[44px] h-11 rounded-full border border-slate-200 bg-white text-[#1a0b33] hover:border-ppf-purple hover:text-ppf-purple disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-[#1a0b33] transition-all flex items-center justify-center"
                aria-label="Previous page"
              >
                <FaChevronLeft size={14} />
              </button>
            )}

            {getVisiblePages().map((pageNum) => (
              <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-[44px] h-11 rounded-full border text-sm font-lato font-bold transition-all ${pageNum === currentPage
                  ? "bg-ppf-purple text-white border-ppf-purple"
                  : "bg-white text-[#1a0b33] border-slate-200 hover:border-ppf-purple hover:text-ppf-purple"
                }`}
            >
              {pageNum}
            </button>
            ))}

            {totalPages > 9 && (
              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="min-w-[44px] h-11 rounded-full border border-slate-200 bg-white text-[#1a0b33] hover:border-ppf-purple hover:text-ppf-purple disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-[#1a0b33] transition-all flex items-center justify-center"
                aria-label="Next page"
              >
                <FaChevronRight size={14} />
              </button>
            )}
          </div>
        )}
      </section>

      <AnimatePresence>
        <EventModal isOpen={!!selectedEvent} onClose={closeEventModal} event={selectedEvent} />
      </AnimatePresence>
    </main>
  );
}

export default ActivitiesContent;
