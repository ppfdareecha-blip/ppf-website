"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, X, checkCircle, XCircle } from "lucide-react";

import AdminNavbar from "@/components/admin/AdminNavbar";
import MembersTab from "@/components/admin/MembersTab";
import EventsTab from "@/components/admin/EventsTab";
import OpinionsTab from "@/components/admin/OpinionsTab";
import AuthorsTab from "@/components/admin/AuthorsTab"; 
import MediaTab from "@/components/admin/MediaTab";
import NewslettersTab from "@/components/admin/NewslettersTab";
import CareersTab from "@/components/admin/CareersTab";
import { ExternalLink } from "lucide-react";
import { User } from "lucide-react";
import {
  MemberOpinionModal,
  EventModal,
  OpinionViewModal,
  OpinionEditModal,
  DownloadableLinkModal,
} from "@/components/admin/AdminModals";
   // sddsfdfd
// ── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("The password entered is incorrect. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-mono-plum flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-white/20">
        <div className="bg-vibrant-violet p-10 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Lock className="w-10 h-10 text-vibrant-violet" />
          </div>
          <h1 className="text-white font-futura text-2xl font-black uppercase tracking-widest">Admin Login</h1>
        </div>
        <form onSubmit={handle} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-mono-plum uppercase tracking-wider block">Access Key</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className="w-full text-black bg-vibrant-offwhite border-2 border-vibrant-gray rounded-2xl px-6 py-4 outline-none focus:border-vibrant-violet transition-all text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-vibrant-charcoal/50 hover:text-vibrant-violet p-2">
                {show ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
          <button className="w-full bg-mono-plum text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-vibrant-violet transition-all active:scale-95 shadow-lg shadow-mono-plum/20">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Admin Dashboard ──────────────────────────────────────────────────────────
export default function AdminControlCenter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  // Data State
  const [pendingOpinions, setPendingOpinions] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminOpinions, setAdminOpinions] = useState([]);
  const [authors, setAuthors] = useState([]); // State for Authors list
  const [careers, setCareers] = useState([]);

  // Modal state
  const [selectedMemberOpinion, setSelectedMemberOpinion] = useState(null);
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [selectedOpinionView, setSelectedOpinionView] = useState(null);
  const [editingOpinion, setEditingOpinion] = useState(null);
  const [linkOpinion, setLinkOpinion] = useState(null);

  // ── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("admin_auth", "true");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  // ── Data fetchers ───────────────────────────────────────────────────────────
  const fetchPending = async () => {
    try {
      const { data } = await fetch(`/api/admin/opinions/pending?t=${Date.now()}`).then(r => r.json());
      if (data) setPendingOpinions(data);
    } catch (e) { console.error(e); }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await fetch(`/api/admin/events?t=${Date.now()}`).then(r => r.json());
      if (data) setEvents(data);
    } catch (e) { console.error(e); }
  };

  const fetchAdminOpinions = async () => {
    try {
      const { data } = await fetch(`/api/admin/opinions-manage?t=${Date.now()}`).then(r => r.json());
      if (data) setAdminOpinions(data);
    } catch (e) { console.error(e); }
  };

  const fetchAuthors = async () => {
    try {
      const { data } = await fetch(`/api/admin/authors?t=${Date.now()}`).then(r => r.json());
      if (data) setAuthors(data);
    } catch (e) { console.error(e); }
  };

  const fetchCareers = async () => {
    try {
      const { data } = await fetch(`/api/admin/careers?t=${Date.now()}`).then(r => r.json());
      if (data) setCareers(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPending();
      fetchEvents();
      fetchAdminOpinions();
      fetchAuthors();
      fetchCareers();
    }
  }, [isAuthenticated]);

  // ── Event handlers ──────────────────────────────────────────────────────────
  const handleDeleteEvent = async (id) => {
    try {
      await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      fetchEvents();
    } catch (e) { console.error(e); }
  };

  const handleDeleteCareer = async (id) => {
    try {
      await fetch(`/api/admin/careers/${id}`, { method: "DELETE" });
      fetchCareers();
    } catch (e) { console.error(e); }
  };

  const handleDeleteOpinion = async (id) => {
    try {
      await fetch(`/api/admin/opinions-manage/${id}`, { method: "DELETE" });
      fetchAdminOpinions();
      fetchAuthors(); // Update author counts
    } catch (e) { console.error(e); }
  };

  const handleApproveMember = async (id) => {
    try {
      const res = await fetch(`/api/admin/opinions/${id}`, { method: "PUT" });
      if (res.ok) {
        setSelectedMemberOpinion(null);
        fetchPending();
        fetchAdminOpinions();
        fetchAuthors(); // Fetch updated authors as their publication count increases
      }
    } catch (e) { console.error(e); }
  };

  const handleRejectMember = async (id) => {
    try {
      const res = await fetch(`/api/admin/opinions/${id}`, { method: "DELETE" });
      if (res.ok) { setSelectedMemberOpinion(null); fetchPending(); }
    } catch (e) { console.error(e); }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  const TAB_BTN = (tab, label) =>
    `px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all ${
      activeTab === tab
        ? "bg-mono-plum text-white shadow-md shadow-mono-plum/20"
        : "bg-white text-vibrant-charcoal/50 border-2 border-vibrant-gray hover:border-mono-plum"
    }`;

  return (
    <div className="min-h-screen bg-[#F1F3F6] font-sans text-vibrant-charcoal leading-relaxed">
      <AdminNavbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto p-8 lg:p-12 space-y-10">
        {/* Tab navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setActiveTab("members")} className={TAB_BTN("members")}>Member Inbox</button>
          <button onClick={() => setActiveTab("authors")} className={TAB_BTN("authors")}>Manage Authors</button>
          <button onClick={() => setActiveTab("opinions")} className={TAB_BTN("opinions")}>Manage Opinions</button>
          <button onClick={() => setActiveTab("events")} className={TAB_BTN("events")}>Manage Events</button>
          <button onClick={() => setActiveTab("careers")} className={TAB_BTN("careers")}>Manage Careers</button>
          <button onClick={() => setActiveTab("media")} className={TAB_BTN("media")}>Manage Media</button>
          <button onClick={() => setActiveTab("newsletters")} className={TAB_BTN("newsletters")}>Newsletters</button>
        </div>

        {activeTab === "members" && (
          <MembersTab
            pendingOpinions={pendingOpinions}
            onSelectOpinion={setSelectedMemberOpinion}
          />
        )}

        {activeTab === "authors" && (
          <AuthorsTab
            authors={authors}
            onRefetch={fetchAuthors}
          />
        )}

        {activeTab === "opinions" && (
          <OpinionsTab
            opinions={adminOpinions}
            authors={authors}
            onSwitchToAuthorsTab={() => setActiveTab("authors")}
            onRefetch={() => {
              fetchAdminOpinions();
              fetchAuthors();
            }}
            onView={setSelectedOpinionView}
            onEdit={setEditingOpinion}
            onDelete={handleDeleteOpinion}
            onAddLink={setLinkOpinion}
          />
        )}

        {activeTab === "events" && (
          <EventsTab
            events={events}
            onRefetch={fetchEvents}
            onDelete={handleDeleteEvent}
            onView={setSelectedEventModal}
          />
        )}

        {activeTab === "careers" && (
          <CareersTab
            careers={careers}
            onRefetch={fetchCareers}
            onDelete={handleDeleteCareer}
          />
        )}

        {activeTab === "media" && (
          <MediaTab />
        )}

        {activeTab === "newsletters" && (
          <NewslettersTab />
        )}
      </main>

      {/* Modals */}
      {selectedMemberOpinion && (
        <MemberOpinionModal
          opinion={selectedMemberOpinion}
          onClose={() => setSelectedMemberOpinion(null)}
          onApprove={handleApproveMember}
          onReject={handleRejectMember}
        />
      )}
      <EventModal event={selectedEventModal} onClose={() => setSelectedEventModal(null)} />
      {selectedOpinionView && (
        <OpinionViewModal opinion={selectedOpinionView} onClose={() => setSelectedOpinionView(null)} />
      )}
      {editingOpinion && (
        <OpinionEditModal
          opinion={editingOpinion}
          authors={authors}
          onClose={() => setEditingOpinion(null)}
          onSaved={() => {
            fetchAdminOpinions();
            fetchAuthors();
          }}
        />
      )}
      {linkOpinion && (
        <DownloadableLinkModal
          opinion={linkOpinion}
          onClose={() => setLinkOpinion(null)}
          onSaved={() => {
            fetchAdminOpinions();
            fetchAuthors();
          }}
        />
      )}

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
    </div>
  );
}