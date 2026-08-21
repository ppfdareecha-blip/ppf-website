"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import EventsTab from "@/components/admin/EventsTab";
import { EventModal } from "@/components/admin/AdminModals";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data } = await fetch(`/api/admin/events?t=${Date.now()}`, { credentials: "include" }).then(r => r.json());
      if (data) setEvents(data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      await fetch(`/api/admin/events/${id}`, { method: "DELETE", credentials: "include" });
      fetchEvents();
    } catch (e) { console.error(e); }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 border-4 border-mono-plum/20 border-t-mono-plum rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <EventsTab
        events={events}
        onRefetch={fetchEvents}
        onDelete={handleDeleteEvent}
        onView={setSelectedEventModal}
      />

      <EventModal event={selectedEventModal} onClose={() => setSelectedEventModal(null)} />

      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-10 border-b-2 border-vibrant-gray flex justify-between items-center bg-vibrant-offwhite sticky top-0 z-10">
              <h2 className="font-futura text-3xl font-black uppercase text-mono-plum">Event Details</h2>
              <button onClick={() => setSelectedEventModal(null)} className="p-3 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum shadow-sm"><X className="w-8 h-8" /></button>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto">
              {selectedEventModal.eventPoster && (
                <img src={selectedEventModal.eventPoster} alt="Event Poster" className="w-full h-64 object-cover rounded-[2rem] border-2 border-mono-plum shadow-lg" />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8F9FA] p-8 rounded-[2rem] border-2 border-vibrant-gray shadow-inner">
                <div className="md:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Event Title</p>
                  <p className="text-xl font-bold text-mono-plum">{selectedEventModal.eventTitle || selectedEventModal.title}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Venue</p>
                  <p className="text-lg font-bold text-mono-plum">{selectedEventModal.location || selectedEventModal.venue}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Speakers</p>
                  <p className="text-lg font-bold text-mono-plum">
                    {selectedEventModal.speakers && selectedEventModal.speakers.length > 0 
                      ? selectedEventModal.speakers.join(", ") 
                      : selectedEventModal.speaker || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Date</p>
                  <p className="text-lg font-bold text-mono-plum">{selectedEventModal.date}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Timing</p>
                  <p className="text-lg font-bold text-mono-plum">{selectedEventModal.time || (`${selectedEventModal.fromTime} - ${selectedEventModal.endTime}`)}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Mode</p>
                  <p className="text-lg font-bold text-mono-plum capitalize">{selectedEventModal.mode || "In-Person"}</p>
                </div>
                {selectedEventModal.centerTag && (
                  <div className="md:col-span-2 pt-2 border-t border-vibrant-gray/50">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Associated Center</p>
                    <span className="inline-block bg-vibrant-violet/10 text-vibrant-violet px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{selectedEventModal.centerTag}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-3">About the Event</p>
                <div className="bg-white p-8 rounded-[2rem] border-2 border-vibrant-gray whitespace-pre-wrap text-vibrant-charcoal/80 leading-relaxed">
                  {selectedEventModal.about}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
