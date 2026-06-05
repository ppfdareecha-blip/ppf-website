"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaRegCalendarAlt, FaMapMarkerAlt, FaUser, FaArrowLeft } from "react-icons/fa";

const centersData = [
  {
    name: 'Centre for Women and Child Welfare',
    abbr: 'PPF-CWCW',
    slug: 'ppf-cwcw',
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/1.jpg',
    description: 'Empowering communities through rigorous research on maternal health, child protection frameworks, and inclusive gender equitable policies.'
  },
  {
    name: 'Centre for New Technologies',
    abbr: 'PPF-CNT',
    slug: 'ppf-cnt',
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/2.jpg',
    description: 'Analyzing the societal, legal, and economic implications of emerging tech, artificial intelligence, and digital transformation landscapes.'
  },
  {
    name: 'Centre for Neighbourhood Studies',
    abbr: 'PPF-CNS',
    slug: 'ppf-cns',
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/3.jpg',
    description: 'Fostering strategic regional cooperation, geopolitical analysis, and cross-border connectivity frameworks across South Asia.'
  },
  {
    name: 'Centre for Disaster Risk Reduction and Management',
    abbr: 'PPF-CDRRM',
    slug: 'ppf-cdrrm',
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/4.jpg',
    description: 'Developing climate resilience models, early warning policy integration, and disaster response preparedness matrixes.'
  },
  {
    name: 'Centre for Cohesive Society Studies',
    abbr: 'PPF-CCSS',
    slug: 'ppf-ccss',
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/5.jpg',
    description: 'Studying multiculturalism, interfaith dialogue, social harmony metrics, and policy interventions for a pluralistic society.'
  },
  {
    name: 'Centre for Radicalisation and Security Studies',
    abbr: 'PPF-CRSS',
    slug: 'ppf-crss',
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/6.jpg',
    description: 'Mapping internal security threats, counter-terrorism doctrines, and strategic de-radicalization pathways.'
  },
  {
    name: 'Centre for Equity and Diversity Studies',
    abbr: 'PPF-CEDS',
    slug: 'ppf-ceds',
    img: 'https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/7.jpg',
    description: 'Advocating for marginalized groups, inclusive governance, socioeconomic representation, and legal literacy programs.'
  }
];

const stripHtml = (html) => {
  if (!html) return "";

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

export default function CenterPage() {
  const { slug } = useParams();
  const [centerEvents, setCenterEvents] = useState([]);
  const [centerOpinions, setCenterOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find targeted center based on URL slug
  const center = centersData.find(c => c.slug === (slug || "").toLowerCase()) || {
    name: "Specialized Policy Division",
    abbr: slug ? `PPF-${slug.toUpperCase()}` : "PPF-CENTER",
    slug: slug || "center",
    img: "https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/centers/1.jpg",
    description: "An elite strategic policy wing focusing on core governance, empirical data research, and sustainable development metrics."
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCenterData = async () => {
      setIsLoading(true);
      try {
        const [eventsRes, opinionsRes] = await Promise.all([
          fetch("/api/events").then(res => res.json()).catch(() => ({})),
          fetch("/api/opinions").then(res => res.json()).catch(() => ({}))
        ]);

        let evts = [];
        if (eventsRes && eventsRes.success && eventsRes.data) {
          evts = eventsRes.data.filter(e => (e.centerTag || "").includes(center.abbr));
        }

        let ops = [];
        if (opinionsRes && opinionsRes.success && opinionsRes.data) {
          ops = opinionsRes.data.filter(o => (o.centerTag || "").includes(center.abbr));
        }

        setCenterEvents(evts);
        setCenterOpinions(ops);
      } catch (err) {
        console.error("Error loading center publications", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCenterData();
  }, [center.abbr]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-lora">
      <Navbar />

      {/* Stunning Cover Banner */}
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src={center.img}
            alt={center.name}
            className="w-full h-full object-cover opacity-30 scale-105 filter blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <Link
            href="/#centers"
            className="inline-flex items-center gap-2 text-xs font-lato font-bold text-ppf-orange uppercase tracking-widest hover:text-white transition-colors mb-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <FaArrowLeft size={10} /> Back to Divisions
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0 relative">
              <img src={center.img} alt={center.name} className="w-full h-full object-cover" />
            </div>

            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-ppf-purple text-white font-lato font-black text-[10px] tracking-[0.2em] uppercase rounded-md mb-3 shadow-sm border border-white/10">
                {center.abbr}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                {center.name}
              </h1>
              <p className="text-slate-300 font-lato text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                {center.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections: Grid Layout */}
      <main className="flex-grow container mx-auto px-6 max-w-7xl py-16">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 font-lato font-bold uppercase tracking-widest text-xs">
            <div className="w-10 h-10 border-2 border-ppf-purple border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading Division Database...
          </div>
        ) : (
          <div className="space-y-16">

            {/* Division Events Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-2 bg-ppf-orange rounded-full" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Associated Events & Engagements
                  </h2>
                  <p className="text-xs font-lato text-slate-500 uppercase tracking-widest mt-1">
                    {centerEvents.length} Record{centerEvents.length === 1 ? '' : 's'} Published
                  </p>
                </div>
              </div>

              {centerEvents.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm max-w-xl mx-auto">
                  <h3 className="text-base font-bold text-slate-700 mb-2">No Active Engagements Yet</h3>
                  <p className="text-sm font-lato text-slate-500 leading-relaxed">
                    There are currently no formal offline seminars or webinars tracked under this strategic wing. Stay tuned for incoming schedule releases.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {centerEvents.map((ev) => (
                    <div key={`ev-${ev.id}`} className="bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl flex flex-col overflow-hidden group">
                      {/* Image Top Half */}
                      <div className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-slate-50">
                        <img
                          src={ev.image || center.img}
                          alt={ev.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-ppf-orange text-white text-[10px] font-lato font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                          Event
                        </div>
                      </div>

                      {/* Content Bottom Half */}
                      <div className="p-6 flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-lato font-bold text-ppf-purple mb-3 uppercase tracking-wide">
                            <FaRegCalendarAlt className="text-ppf-orange" /> <span>{ev.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-ppf-purple transition-colors line-clamp-2">
                            {ev.title}
                          </h3>
                          {ev.speaker && (
                            <span className="inline-block text-[11px] font-lato font-bold text-ppf-teal bg-teal-50 px-2 py-0.5 rounded mb-3">
                              Speaker: {ev.speaker}
                            </span>
                          )}
                          <p className="text-slate-600 font-lato text-xs leading-relaxed line-clamp-3 mb-6">
                            {ev.about || ev.summary}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-lato truncate max-w-[140px]">
                            <FaMapMarkerAlt className="flex-shrink-0" /> {ev.location}
                          </span>
                          <Link
                            href={`/pages/activities/${ev.id}`}
                            className="text-xs font-lato font-black text-ppf-purple hover:text-ppf-orange transition-colors"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Division Opinions Section */}
            <section className="pt-8 border-t border-slate-200/60">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-2 bg-ppf-purple rounded-full" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Research Articles & Expert Opinions
                  </h2>
                  <p className="text-xs font-lato text-slate-500 uppercase tracking-widest mt-1">
                    {centerOpinions.length} Insight{centerOpinions.length === 1 ? '' : 's'} Published
                  </p>
                </div>
              </div>

              {centerOpinions.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm max-w-xl mx-auto">
                  <h3 className="text-base font-bold text-slate-700 mb-2">No Research Opinions Yet</h3>
                  <p className="text-sm font-lato text-slate-500 leading-relaxed">
                    Strategic analyses and expert briefs tied to this division are being peer-reviewed. Check back shortly for deep-dive publications.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {centerOpinions.map((op) => (
                    <div key={`op-${op._id}`} className="bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl flex flex-col overflow-hidden group">
                      {/* Image Top Half */}
                      <div className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-slate-50">
                        <img
                          src={op.image || center.img}
                          alt={op.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-ppf-purple text-white text-[10px] font-lato font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                          Opinion
                        </div>
                      </div>

                      {/* Content Bottom Half */}
                      <div className="p-6 flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-lato font-bold text-ppf-teal mb-3 uppercase tracking-wide">
                            <FaRegCalendarAlt className="text-slate-400" /> <span>{op.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-ppf-purple transition-colors line-clamp-2">
                            {op.title}
                          </h3>
                          <p className="text-slate-600 font-lato text-xs leading-relaxed line-clamp-3 mb-6">
                            {stripHtml(op.content)}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-lora font-bold text-slate-800 truncate max-w-[150px]">
                            <FaUser className="text-slate-300 text-[10px] flex-shrink-0" /> {op.author}
                          </span>
                          <Link
                            href={`/pages/opinions/${op._id}`}
                            className="text-xs font-lato font-black text-ppf-purple hover:text-ppf-orange transition-colors flex-shrink-0"
                          >
                            Read Article →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
