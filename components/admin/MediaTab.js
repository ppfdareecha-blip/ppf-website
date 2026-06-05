import React, { useCallback, useState, useEffect, useRef } from "react";
import { Edit3, Save, X } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";

const toThreeSlots = (values, fallback = "") => {
  const normalized = (Array.isArray(values) && values.length ? values : [fallback || values])
    .map((value) => (typeof value === "string" ? value : ""))
    .slice(0, 3);

  while (normalized.length < 3) normalized.push("");
  return normalized;
};

const getFieldLabel = (slotKey) => (
  slotKey === "youtube" ? "Video ID" : slotKey === "linkedin" ? "LinkedIn URN" : "Post URL"
);

const getPlaceholder = (slotKey) => (
  slotKey === "youtube"
    ? "dQw4w9WgXcQ"
    : slotKey === "instagram"
    ? "https://www.instagram.com/p/..."
    : slotKey === "linkedin"
    ? "urn:li:share:..."
    : "https://x.com/user/status/..."
);

export default function MediaTab() {
  const [mediaLinks, setMediaLinks] = useState({
    youtube: { values: ["", "", ""], label: "YouTube" },
    instagram: { values: ["", "", ""], label: "Instagram" },
    linkedin: { values: ["", "", ""], label: "LinkedIn" },
    x: { values: ["", "", ""], label: "X (Twitter)" },
  });
  
  const [editingSlot, setEditingSlot] = useState(null);
  const [editingValues, setEditingValues] = useState(["", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  // Fetch existing media links
  const fetchMediaLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const media = data.data[0];
        setMediaLinks({
          youtube: { values: toThreeSlots(media.youtubeVideoIds, media.youtubeVideoId), label: "YouTube" },
          instagram: { values: toThreeSlots(media.instagramPostUrls, media.instagramPostUrl), label: "Instagram" },
          linkedin: { values: toThreeSlots(media.linkedinUrns, media.linkedinUrn), label: "LinkedIn" },
          x: { values: toThreeSlots(media.xPostUrls, media.xPostUrl), label: "X (Twitter)" },
        });
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMediaLinks();
  }, [fetchMediaLinks]);

  // GSAP animation on load
  useEffect(() => {
    if (containerRef.current && !loading) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  const handleEditClick = (slot) => {
    setEditingSlot(slot);
    setEditingValues(toThreeSlots(mediaLinks[slot].values));
    setErrorMsg("");
  };

  const handleSave = async (slot) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const nextValues = toThreeSlots(editingValues);
    const hasAtLeastOneValue = nextValues.some((value) => value.trim());

    if (!hasAtLeastOneValue) {
      setErrorMsg("Add at least one link/ID");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the update payload
      const updateData = {
        youtubeVideoIds: mediaLinks.youtube.values,
        instagramPostUrls: mediaLinks.instagram.values,
        linkedinUrns: mediaLinks.linkedin.values,
        xPostUrls: mediaLinks.x.values,
      };

      // Update the correct slot
      if (slot === "youtube") updateData.youtubeVideoIds = nextValues;
      else if (slot === "instagram") updateData.instagramPostUrls = nextValues;
      else if (slot === "linkedin") updateData.linkedinUrns = nextValues;
      else if (slot === "x") updateData.xPostUrls = nextValues;

      const res = await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (data.success) {
        setMediaLinks((prev) => ({
          ...prev,
          [slot]: {
            ...prev[slot],
            values: nextValues,
          },
        }));
        setSuccessMsg(`${mediaLinks[slot].label} links updated!`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Failed to save");
      }
    } catch (err) {
      setErrorMsg("Error saving link");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setEditingSlot(null);
      setEditingValues(["", "", ""]);
    }
  };

  const handleCancel = () => {
    setEditingSlot(null);
    setEditingValues(["", "", ""]);
    setErrorMsg("");
  };

  const SLOTS = [
    { key: "youtube" },
    { key: "instagram" },
    { key: "linkedin" },
    { key: "x" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-ppf-teal/20 border-t-ppf-teal rounded-full mx-auto"></div>
          <p className="text-slate-600 mt-4 font-lato">Loading media links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-lato">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-ppf-purple rounded-full"></div>
          <h1 className="text-3xl md:text-4xl font-black font-futura uppercase text-slate-900">Social Media Management</h1>
        </div>
        <p className="text-slate-600 ml-6 text-sm md:text-base font-lato">Manage the links shown on the public Media page</p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 font-semibold text-sm flex items-start gap-3">
          <X size={20} className="flex-shrink-0 mt-0.5" />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 font-semibold text-sm">
          Saved. {successMsg}
        </div>
      )}

      {/* Media Slots Grid */}
      <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        {SLOTS.map((slot) => {
          const Icon = {
            youtube: FaYoutube,
            instagram: FaInstagram,
            linkedin: FaLinkedinIn,
            x: FaXTwitter,
          }[slot.key];
          const slotData = mediaLinks[slot.key];
          const currentValues = toThreeSlots(slotData.values);
          const isEditing = editingSlot === slot.key;

          return (
            <div
              key={slot.key}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:border-slate-300 transition"
            >
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-white text-slate-900">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Social Media</p>
                    <h3 className="text-2xl font-futura font-black uppercase mt-1">{slotData.label}</h3>
                  </div>
                  <div className="h-11 w-11 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
                    <Icon className="text-xl" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {isEditing ? (
                  <>
                    {/* Edit Mode */}
                    <div className="space-y-3">
                      {editingValues.map((value, index) => (
                        <div key={index}>
                          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                            {getFieldLabel(slot.key)} {index + 1}
                          </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              const nextValues = [...editingValues];
                              nextValues[index] = e.target.value;
                              setEditingValues(nextValues);
                            }}
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-ppf-teal focus:outline-none focus:bg-white transition font-lato font-semibold placeholder-slate-400 text-sm"
                            placeholder={getPlaceholder(slot.key)}
                            autoFocus={index === 0}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(slot.key)}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-ppf-purple hover:bg-ppf-purple/90 text-white font-bold rounded-lg transition duration-200 disabled:opacity-60 uppercase text-xs tracking-wide"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition duration-200 uppercase text-xs tracking-wide"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Current {getFieldLabel(slot.key)} Slots
                      </p>
                      {currentValues.some(Boolean) ? (
                        <div className="space-y-2">
                          {currentValues.map((value, index) => (
                            <div
                              key={index}
                              className={`px-3 py-2 border-2 rounded-lg text-xs break-all ${
                                value
                                  ? "bg-slate-50 border-slate-300 text-slate-700 font-mono"
                                  : "bg-slate-100 border-dashed border-slate-300 text-slate-500 font-semibold italic"
                              }`}
                            >
                              <span className="font-black uppercase tracking-widest text-[9px] mr-2 text-slate-400">
                                {index + 1}.
                              </span>
                              {value || "Empty slot"}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-semibold italic text-center py-4">
                          No links set
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleEditClick(slot.key)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-ppf-purple text-white font-bold rounded-lg transition duration-200 uppercase text-xs tracking-wide"
                    >
                      <Edit3 size={16} />
                      Edit Links
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-4xl shadow-sm">
        <h3 className="font-futura font-black uppercase text-slate-900 mb-3">Input Guide</h3>
        <ul className="text-sm text-slate-700 space-y-2">
          <li><strong>YouTube:</strong> Add up to 3 video IDs (e.g., dQw4w9WgXcQ from youtube.com/watch?v=dQw4w9WgXcQ)</li>
          <li><strong>Instagram:</strong> Add up to 3 full post URLs (e.g., https://www.instagram.com/p/ABC123xyz/)</li>
          <li><strong>LinkedIn:</strong> Add up to 3 URN codes (e.g., urn:li:share:7455579186855038976)</li>
          <li><strong>X (Twitter):</strong> Add up to 3 full post URLs (e.g., https://x.com/user/status/1234567890)</li>
        </ul>
      </div>
    </div>
  );
}


