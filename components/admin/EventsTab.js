import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Send, Image as ImageIcon, Eye, Trash2, Pencil, Search } from "lucide-react";
import TimeSelector from "./TimeSelector";
import { PREDEFINED_CENTERS } from "./constants";

export default function EventsTab({ events, onDelete, onView, onRefetch }) {
  const [form, setForm] = useState({ title: "", venue: "", date: "", fromTime: "10:00 AM", toTime: "11:00 AM", about: "", speaker: "", mode: "", centerTag: "", pdfLink: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const url = editingEventId ? `/api/admin/events/${editingEventId}` : "/api/admin/events";
      const method = editingEventId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, modeInput: form.mode, imageBase64 }),
      });
      if (res.ok) {
        setForm({ title: "", venue: "", date: "", fromTime: "10:00 AM", toTime: "11:00 AM", about: "", speaker: "", mode: "", centerTag: "", pdfLink: "" });
        setImagePreview(null);
        setImageBase64("");
        setEditingEventId(null);
        if (onRefetch) onRefetch(); // triggers parent refetch
      }
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  const handleEditClick = (event) => {
    setEditingEventId(event._id);
    setForm({
      title: event.title || "",
      venue: event.venue || "",
      date: event.date || "",
      fromTime: event.fromTime || "10:00 AM",
      toTime: event.endTime || event.toTime || "11:00 AM",
      about: event.about || "",
      speaker: Array.isArray(event.speakers) ? event.speakers.join(", ") : (event.speaker || ""),
      centerTag: event.centers || event.center || "", mode: event.mode || "",
      pdfLink: event.pdfLink || ""
    });
    setImagePreview(event.eventPoster || event.imageUrl || null);
    setImageBase64("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setForm({ title: "", venue: "", date: "", fromTime: "10:00 AM", toTime: "11:00 AM", about: "", speaker: "", mode: "", centerTag: "", pdfLink: "" });
    setImagePreview(null);
    setImageBase64("");
  };

  const latestEvent = events.length > 0 ? events.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b) : null;

  return (
    <div className="space-y-10">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#8B5CF6] sm:shadow-[6px_6px_0px_#8B5CF6] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-mono-plum font-futura">{events.length}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Total Events</span>
        </div>
        <div className="bg-white border-2 border-vibrant-teal rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#14B8A6] sm:shadow-[6px_6px_0px_#14B8A6] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-vibrant-teal font-futura">
            {events.filter(e => new Date(e.date) > new Date()).length}
          </span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Upcoming</span>
        </div>
        <div className="bg-white border-2 border-vibrant-violet rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#7C3AED] sm:shadow-[6px_6px_0px_#7C3AED] flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
          <span className="text-sm sm:text-lg font-black text-vibrant-violet font-futura line-clamp-1">
            {latestEvent ? latestEvent.title : "—"}
          </span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">
            Latest Event {latestEvent ? `(${latestEvent.date})` : ""}
          </span>
        </div>
      </div>
      {/* Create / Edit form */}
      <div className="bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-[8px_8px_0px_#8B5CF6] sm:shadow-[12px_12px_0px_#8B5CF6]">
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="p-2 sm:p-3 bg-vibrant-violet/10 rounded-xl">
            {editingEventId ? <Pencil className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" /> : <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" />}
          </div>
          <h2 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">
            {editingEventId ? "Edit Event" : "Create New Event"}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          <input type="text" placeholder="Event Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base sm:col-span-2" />
          <input type="text" placeholder="Venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base" />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base" />
          <TimeSelector placeholder="From Time" value={form.fromTime} onChange={val => setForm({ ...form, fromTime: val })} />
          <TimeSelector placeholder="To Time" value={form.toTime} onChange={val => setForm({ ...form, toTime: val })} />
          <input type="text" placeholder="Speaker (Optional)" value={form.speaker} onChange={e => setForm({ ...form, speaker: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base" />
          <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none text-sm sm:text-base">
            <option value="">Select Mode (Optional)</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
          </select>
          <select value={form.centerTag} onChange={e => setForm({ ...form, centerTag: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none text-sm sm:text-base">
            <option value="">Select a Center (Optional)</option>
            {PREDEFINED_CENTERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="PDF Link (Optional)" value={form.pdfLink} onChange={e => setForm({ ...form, pdfLink: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base sm:col-span-2" />
          <textarea placeholder="About the Event" value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} className="w-full min-h-[100px] sm:min-h-[120px] p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base sm:col-span-2" />
        </div>

        {imagePreview && (
          <div className="mt-5 sm:mt-6 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 border-mono-plum group">
            <img src={imagePreview} alt="Preview" className="w-full h-40 sm:h-64 object-cover" />
            <button onClick={() => { setImagePreview(null); setImageBase64(""); }} className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 sm:p-3 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-xl border-2 border-white">
              <X className="w-4 sm:w-6 h-4 sm:h-6" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:gap-6 mt-5 sm:mt-10">
          <label className="w-full flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-vibrant-offwhite text-mono-plum rounded-xl sm:rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-vibrant-gray">
            <ImageIcon className="w-4 sm:w-5 h-4 sm:h-5" /> Attach Event Poster
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {editingEventId && (
              <button onClick={handleCancelEdit} className="flex items-center justify-center px-5 sm:px-8 py-3 sm:py-5 bg-white border-2 border-mono-plum text-mono-plum rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-base hover:bg-vibrant-gray transition-all shadow-md">
                Cancel
              </button>
            )}
            <button onClick={handleSave} disabled={isSubmitting} className="flex items-center justify-center gap-2 sm:gap-3 flex-1 sm:flex-none px-5 sm:px-12 py-3 sm:py-5 bg-mono-plum text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-base hover:bg-vibrant-violet transition-all shadow-xl shadow-mono-plum/20 active:translate-y-1 disabled:opacity-50">
              {editingEventId ? (isSubmitting ? "Updating..." : "Update Event") : (isSubmitting ? "Creating..." : "Create Event")} <Send className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Events list */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4 px-0">
        <h3 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">Manage Events</h3>
        <select 
          value={selectedCenter} 
          onChange={e => setSelectedCenter(e.target.value)}
          className="w-full sm:w-auto p-2.5 sm:p-4 bg-white border-2 border-vibrant-gray rounded-lg sm:rounded-2xl focus:border-mono-plum outline-none font-bold text-xs sm:text-sm uppercase tracking-widest text-vibrant-charcoal"
        >
          <option value="">All Centers</option>
          {PREDEFINED_CENTERS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 px-0">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-4 bg-white rounded-lg sm:rounded-2xl border-2 border-vibrant-gray focus:border-mono-plum outline-none text-xs sm:text-sm text-black font-semibold transition-all shadow-sm"
        />
        <Search className="w-4 sm:w-5 h-4 sm:h-5 text-vibrant-charcoal/40 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-vibrant-charcoal/40 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-vibrant-gray/50"
          >
            <X className="w-3 sm:w-4 h-3 sm:h-4" />
          </button>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-vibrant-offwhite border-b-2 border-vibrant-gray">
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Event Details</th>
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Timing &amp; Speaker</th>
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-vibrant-gray">
              {events.filter(event => {
                const matchesCenter = selectedCenter ? (event.center || event.centerTag || event.centers || event.tag) === selectedCenter : true;
                const query = searchQuery.toLowerCase();
                const matchesSearch = !searchQuery || 
                  event.title?.toLowerCase().includes(query) || 
                  event.venue?.toLowerCase().includes(query) || 
                  event.speaker?.toLowerCase().includes(query) ||
                  (Array.isArray(event.speakers) && event.speakers.some(s => s.toLowerCase().includes(query))) ||
                  event.about?.toLowerCase().includes(query);
                return matchesCenter && matchesSearch;
              }).map((event) => (
                <tr key={event._id} className="hover:bg-vibrant-offwhite/50 transition-colors">
                  <td className="px-4 sm:px-10 py-5 sm:py-8 flex gap-3 sm:gap-4 items-start sm:items-center">
                    {(event.eventPoster || event.imageUrl) && <img src={event.eventPoster || event.imageUrl} alt="Poster" className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl object-cover flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-base sm:text-xl text-mono-plum mb-1 font-bold line-clamp-1">{event.title}</p>
                      <p className="text-xs sm:text-sm text-vibrant-charcoal/60 mb-1 line-clamp-1">{event.venue}</p>
                      <p className="text-[9px] sm:text-[10px] text-vibrant-charcoal/40 uppercase tracking-widest">Date: {event.date}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-10 py-5 sm:py-8">
                    <p className="text-base sm:text-lg font-black text-mono-plum">{event.fromTime} - {event.endTime || event.toTime}</p>
                    <p className="text-[9px] sm:text-[10px] font-black text-vibrant-teal uppercase tracking-widest line-clamp-1">
                      {Array.isArray(event.speakers) && event.speakers.length > 0 ? event.speakers.join(", ") : (event.speaker || "None")}
                    </p>
                  </td>
                  <td className="px-4 sm:px-10 py-5 sm:py-8">
                    <div className="flex justify-end gap-2 sm:gap-4">
                      <button onClick={() => onView(event)} className="flex items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white border-2 border-vibrant-gray rounded-lg sm:rounded-2xl hover:border-vibrant-teal hover:bg-vibrant-teal hover:text-white transition-all text-xs sm:text-sm uppercase px-2.5 sm:px-6">
                        <Eye className="w-4 sm:w-5 h-4 sm:h-5" /> <span className="hidden sm:inline">View</span>
                      </button>
                      <button onClick={() => handleEditClick(event)} className="flex items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white border-2 border-vibrant-gray rounded-lg sm:rounded-2xl hover:border-vibrant-violet hover:bg-vibrant-violet hover:text-white transition-all text-xs sm:text-sm uppercase px-2.5 sm:px-6">
                        <Pencil className="w-4 sm:w-5 h-4 sm:h-5" /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button onClick={() => setEventToDelete(event)} className="flex items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white border-2 border-red-200 text-red-600 rounded-lg sm:rounded-2xl hover:bg-red-600 hover:text-white transition-all text-xs sm:text-sm uppercase px-2.5 sm:px-6">
                        <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" /> <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {events.filter(event => {
          const matchesCenter = selectedCenter ? (event.center || event.centerTag || event.centers || event.tag) === selectedCenter : true;
          const query = searchQuery.toLowerCase();
          const matchesSearch = !searchQuery || 
            event.title?.toLowerCase().includes(query) || 
            event.venue?.toLowerCase().includes(query) || 
            event.speaker?.toLowerCase().includes(query) ||
            (Array.isArray(event.speakers) && event.speakers.some(s => s.toLowerCase().includes(query))) ||
            event.about?.toLowerCase().includes(query);
          return matchesCenter && matchesSearch;
        }).map((event) => (
          <div key={event._id} className="bg-white border-2 border-vibrant-gray rounded-lg p-3 shadow-md hover:shadow-lg hover:border-mono-plum transition-all">
            <div className="flex gap-2 sm:gap-3 mb-3">
              {(event.eventPoster || event.imageUrl) && <img src={event.eventPoster || event.imageUrl} alt="Poster" className="w-14 sm:w-16 h-14 sm:h-16 rounded-lg object-cover flex-shrink-0" />}
              <div className="flex-grow min-w-0">
                <p className="text-sm sm:text-base font-bold text-mono-plum line-clamp-1">{event.title}</p>
                <p className="text-xs text-vibrant-charcoal/60 mb-1 line-clamp-1">{event.venue}</p>
                <p className="text-[9px] text-vibrant-charcoal/40 uppercase tracking-widest">{event.date}</p>
              </div>
            </div>
            <div className="mb-3 pb-3 border-b border-vibrant-gray/50">
              <p className="text-xs sm:text-sm font-bold text-mono-plum mb-1">{event.fromTime} - {event.endTime || event.toTime}</p>
              <p className="text-[8px] sm:text-[9px] font-bold text-vibrant-teal uppercase tracking-widest line-clamp-1">
                {Array.isArray(event.speakers) && event.speakers.length > 0 ? event.speakers.join(", ") : "No speaker"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onView(event)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-vibrant-teal text-white rounded-lg hover:bg-vibrant-teal/80 transition-all text-xs font-bold uppercase">
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button onClick={() => handleEditClick(event)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-vibrant-violet text-white rounded-lg hover:bg-vibrant-violet/80 transition-all text-xs font-bold uppercase">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => setEventToDelete(event)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-bold uppercase">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {eventToDelete && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-mono-plum text-center relative overflow-hidden">
            
            {/* Decorative background gradients */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-vibrant-violet/20 rounded-full blur-3xl opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-white shadow-xl">
                <Trash2 className="w-10 h-10" />
              </div>
              
              <h3 className="font-futura text-3xl font-black uppercase tracking-wide text-mono-plum mb-4">
                Delete Event?
              </h3>
              
              <p className="text-vibrant-charcoal/70 mb-6 font-medium leading-relaxed text-lg px-2">
                You are about to permanently delete the event: <br/>
                <span className="inline-block mt-4 px-4 py-3 bg-vibrant-offwhite border-2 border-vibrant-gray rounded-xl font-bold text-mono-plum shadow-inner">
                  {eventToDelete.title}
                </span>
              </p>
              
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-10 inline-block shadow-sm">
                Warning: This action cannot be undone
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => setEventToDelete(null)} 
                  className="flex-1 py-5 bg-white border-2 border-vibrant-gray text-vibrant-charcoal rounded-2xl font-black uppercase tracking-widest text-sm hover:border-mono-plum hover:bg-vibrant-offwhite transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onDelete(eventToDelete._id);
                    setEventToDelete(null);
                  }} 
                  className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 shadow-[0_8px_0px_#991B1B] active:translate-y-2 active:shadow-[0_0px_0px_#991B1B] transition-all"
                >
                  Yes, Delete It
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
