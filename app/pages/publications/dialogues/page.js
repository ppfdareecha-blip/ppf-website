"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DialoguesPage() {
  const [dialogues, setDialogues] = useState([]);
  const [loading, setLoading] = useState(true);

// test comment

  useEffect(() => {
    const fetchDialogues = async () => {
      try {
        const res = await fetch("/api/dialogues");
        const json = await res.json();
        if (json.success) {
          setDialogues(json.data);
        }
      } catch (err) {
        console.error("Failed to load dialogues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDialogues();
  }, []);

  const handleCardClick = (dialogue) => {
    const url = dialogue.reportPdf || dialogue.pdfLink;
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-900 font-lato overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[5%] -right-[5%] w-[45rem] h-[45rem] rounded-full bg-ppf-teal/15 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[40%] -left-[10%] w-[50rem] h-[50rem] rounded-full bg-ppf-purple/15 blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-slate-900 uppercase tracking-tight mb-4">
              PPF <span className="text-ppf-purple">Dialogues</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Explore our series of expert dialogues and critical conversations addressing key national and regional policy frameworks.
            </p>
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-ppf-purple rounded-full animate-spin" />
              <p className="mt-4 text-sm font-semibold text-slate-500">Loading Dialogues...</p>
            </div>
          ) : (
            <>
              {dialogues.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <p>No dialogues found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {dialogues.map((dialogue) => (
                    <div 
                      key={dialogue._id} 
                      onClick={() => handleCardClick(dialogue)}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group flex flex-col border border-slate-100 hover:border-ppf-purple/30"
                    >
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100">
                        {dialogue.image ? (
                          <img 
                            src={dialogue.image} 
                            alt={dialogue.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-ppf-purple/20 to-ppf-teal/20 flex items-center justify-center">
                            <span className="text-ppf-purple/50 font-black uppercase tracking-widest text-xs">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                      <div className="p-5 flex flex-col flex-1 relative">
                        <h3 className="font-lora font-bold text-slate-900 text-lg md:text-xl leading-snug mb-3 group-hover:text-ppf-purple transition-colors line-clamp-2">
                          {dialogue.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {dialogue.description}
                        </p>
                        <div className="mt-auto">
                          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-ppf-teal bg-ppf-teal/10 px-3 py-1.5 rounded-md inline-block">
                            {dialogue.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
