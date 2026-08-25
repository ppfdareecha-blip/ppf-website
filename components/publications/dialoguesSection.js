"use client";

import { MessageSquare, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const SectionHeader = ({ title, subtitle, onAction }) => (
  <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-l-4 border-ppf-purple pl-5">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">
          {title}
        </h2>
      </div>
      <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    </div>
    <button
      onClick={onAction}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-ppf-purple text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors group shrink-0"
    >
      View All
      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default function DialoguesSection({ data = [] }) {
  const router = useRouter();

  const handleCardClick = (dialogue) => {
    const url = dialogue.reportPdf || dialogue.pdfLink;
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <section id="dialogues" className="w-full py-16 px-8 md:px-16 lg:px-24 xl:px-32 bg-slate-50">
      <SectionHeader
        title="PPF Dialogues"
        subtitle="Explore our recent series of expert dialogues and critical conversations addressing key policy frameworks."
        onAction={() => router.push("/pages/publications/dialogues")}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
        {data.slice(0, 2).map((dialogue) => (
          <div 
            key={dialogue._id} 
            onClick={() => handleCardClick(dialogue)}
            className="group relative flex flex-col sm:flex-row gap-4 p-4 md:p-5 bg-white border border-slate-200 rounded-xl hover:shadow-xl hover:border-ppf-purple/30 transition-all duration-500 overflow-hidden cursor-pointer"
          >
            {/* Hover Accent Strip */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-ppf-purple transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

            {/* Image Container */}
            <div className="relative w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-lg shadow-inner bg-slate-100">
              {dialogue.image ? (
                <img 
                  src={dialogue.image} 
                  alt={dialogue.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-ppf-purple/20 to-ppf-teal/20 flex items-center justify-center">
                  <span className="text-ppf-purple/50 font-black uppercase tracking-widest text-[10px]">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
              <span className="absolute top-2 left-2 bg-ppf-orange text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-tighter">
                Dialogue
              </span>
            </div>

            {/* Content Area */}
            <div className="flex flex-col justify-between flex-1 py-1">
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 group-hover:text-ppf-purple leading-snug transition-colors line-clamp-2">
                  {dialogue.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {dialogue.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-ppf-teal bg-ppf-teal/10 px-2 py-1 rounded inline-block">
                  {dialogue.date}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-black text-ppf-purple uppercase tracking-wider">
                  View
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
