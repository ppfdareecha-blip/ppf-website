"use client";
import { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, ExternalLink, User, Image as ImageIcon, Edit, Save } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { PREDEFINED_TAGS, PREDEFINED_CENTERS } from "./constants";
import ImagePickerModal from "./ImagePickerModal";


// ── Pending member opinion modal ─────────────────────────────────────────────
export function MemberOpinionModal({ opinion, onClose, onApprove, onReject }) {
  if (!opinion) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl">
        <div className="p-12 space-y-10">
          <div className="flex justify-between items-center border-b-2 border-vibrant-gray pb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-mono-plum rounded-2xl flex items-center justify-center text-white font-black text-2xl">{opinion.avatar}</div>
              <div>
                <h3 className="font-futura text-xl font-black uppercase text-mono-plum leading-none mb-2">{opinion.user}</h3>
                <span className="text-xs font-black text-vibrant-violet bg-vibrant-violet/10 px-3 py-1 rounded-full uppercase tracking-widest">{opinion.level}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-vibrant-offwhite rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum"><X className="w-8 h-8" /></button>
          </div>
          <div className="bg-[#F8F9FA] p-10 rounded-[2.5rem] border-2 border-vibrant-gray relative italic font-semibold text-mono-plum leading-relaxed text-xl shadow-inner">
            &quot;{opinion.text}&quot;
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <button onClick={() => onApprove(opinion.id)} className="flex items-center justify-center gap-3 py-6 bg-vibrant-teal text-white rounded-[1.5rem] font-black uppercase tracking-widest text-base hover:brightness-110 shadow-lg shadow-vibrant-teal/30 active:translate-y-1 transition-all"><CheckCircle className="w-6 h-6" /> Approve Member</button>
            <button onClick={() => onReject(opinion.id)} className="flex items-center justify-center gap-3 py-6 border-4 border-red-500 text-red-500 rounded-[1.5rem] font-black uppercase tracking-widest text-base hover:bg-red-50 active:translate-y-1 transition-all"><XCircle className="w-6 h-6" /> Reject Member</button>
          </div>
        </div>
        <div className="bg-vibrant-offwhite px-12 py-6 flex justify-between items-center border-t-2 border-vibrant-gray">
          <button className="text-xs font-black text-mono-plum uppercase tracking-[0.2em] flex items-center gap-2 hover:text-vibrant-violet transition-colors"><ExternalLink className="w-5 h-5" /> View Member History</button>
          <span className="text-[10px] font-black uppercase tracking-widest text-vibrant-charcoal/40">Reference ID: {opinion.id}</span>
        </div>
      </div>
    </div>
  );
}

// ── Event detail modal ───────────────────────────────────────────────────────
export function EventModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-10 border-b-2 border-vibrant-gray flex justify-between items-center bg-vibrant-offwhite sticky top-0 z-10">
          <h2 className="font-futura text-3xl font-black uppercase text-mono-plum">Event Details</h2>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum shadow-sm"><X className="w-8 h-8" /></button>
        </div>
        <div className="p-10 space-y-8 overflow-y-auto">
          {event.imageUrl && <img src={event.imageUrl} alt="Event Poster" className="w-full h-64 object-cover rounded-[2rem] border-2 border-mono-plum shadow-lg" />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8F9FA] p-8 rounded-[2rem] border-2 border-vibrant-gray shadow-inner">
            <div className="md:col-span-2"><p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Event Title</p><p className="text-xl font-bold text-mono-plum">{event.title}</p></div>
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Venue</p><p className="text-lg font-bold text-mono-plum">{event.venue}</p></div>
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Speaker</p><p className="text-lg font-bold text-mono-plum">{event.speaker || "None"}</p></div>
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Date</p><p className="text-lg font-bold text-mono-plum">{event.date}</p></div>
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Timing</p><p className="text-lg font-bold text-mono-plum">{event.fromTime} - {event.toTime}</p></div>
            {event.centerTag && (
              <div className="md:col-span-2 pt-2 border-t border-vibrant-gray/50">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Associated Center</p>
                <span className="inline-block bg-vibrant-violet/10 text-vibrant-violet px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{event.centerTag}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-3">About the Event</p>
            <div className="bg-white p-8 rounded-[2rem] border-2 border-vibrant-gray whitespace-pre-wrap text-vibrant-charcoal/80 leading-relaxed">{event.about}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin opinion view modal ─────────────────────────────────────────────────
export function OpinionViewModal({ opinion, onClose }) {
  if (!opinion) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-10 border-b-2 border-vibrant-gray flex justify-between items-center bg-vibrant-offwhite sticky top-0 z-10">
          <h2 className="font-futura text-3xl font-black uppercase text-mono-plum">Opinion Details</h2>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum shadow-sm"><X className="w-8 h-8" /></button>
        </div>
        <div className="p-10 space-y-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {opinion.imageUrl && <img src={opinion.imageUrl} alt="Opinion Image" className="w-full md:w-1/3 h-48 object-cover rounded-[2rem] border-2 border-mono-plum shadow-lg shrink-0" />}
            <div className="flex-1 space-y-4">
              <h3 className="font-futura text-2xl font-black uppercase text-mono-plum leading-tight">{opinion.title}</h3>
              <div className="flex flex-wrap gap-4">
                <span className="bg-vibrant-violet/10 text-vibrant-violet px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">{opinion.tag || "Untagged"}</span>
                {opinion.centerTag && <span className="bg-vibrant-teal/10 text-vibrant-teal px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">{opinion.centerTag}</span>}
                <span className="bg-vibrant-gray text-vibrant-charcoal/60 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">{opinion.dateAndTime}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-3">Description</p>
            <div className="bg-[#F8F9FA] p-8 rounded-[2rem] border-2 border-vibrant-gray text-vibrant-charcoal/80 leading-relaxed shadow-inner opinion-rich-content" dangerouslySetInnerHTML={{ __html: opinion.description }} />
            <style>{`
              .opinion-rich-content h1{font-size:1.5rem;font-weight:800;margin:.75rem 0;color:#1a1a2e}
              .opinion-rich-content h2{font-size:1.25rem;font-weight:700;margin:.75rem 0;color:#1a1a2e}
              .opinion-rich-content h3{font-size:1.1rem;font-weight:700;margin:.5rem 0;color:#1a1a2e}
              .opinion-rich-content p{margin:.5rem 0}
              .opinion-rich-content strong{font-weight:700}
              .opinion-rich-content em{font-style:italic}
              .opinion-rich-content ul{list-style:disc;padding-left:1.5rem;margin:.5rem 0}
              .opinion-rich-content ol{list-style:decimal;padding-left:1.5rem;margin:.5rem 0}
              .opinion-rich-content li{margin:.25rem 0}
              .opinion-rich-content blockquote{border-left:4px solid #8B5CF6;padding:.25rem 0 .25rem 1rem;color:#6b7280;font-style:italic;margin:.75rem 0}
              .opinion-rich-content pre{background:#1e1e2e;color:#cdd6f4;border-radius:.5rem;padding:1rem;font-size:13px;overflow-x:auto;margin:.75rem 0}
              .opinion-rich-content code{background:#f3f4f6;padding:.15rem .35rem;border-radius:.25rem;font-size:.875em}
              .opinion-rich-content table{border-collapse:collapse;width:100%;margin:1rem 0}
              .opinion-rich-content table td,.opinion-rich-content table th{border:1px solid #d1d5db;padding:8px 12px;text-align:left}
              .opinion-rich-content table th{background:#f4f4f6;font-weight:700}
              .opinion-rich-content img{max-width:100%;border-radius:.5rem;margin:.5rem 0}
              .opinion-rich-content a{color:#8B5CF6;text-decoration:underline}
            `}</style>
          </div>
          {opinion.authors && opinion.authors.length > 0 ? (
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Authors</p>
              {opinion.authors.map((auth, idx) => (
                <div key={idx} className="bg-white border-2 border-mono-plum rounded-[2.5rem] p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-[6px_6px_0px_#8B5CF6]">
                  {auth.profilePictureUrl ? (
                    <img src={auth.profilePictureUrl} alt="Author" className="w-20 h-20 rounded-full object-cover border-4 border-vibrant-offwhite shadow-md shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-vibrant-offwhite border-2 border-vibrant-gray flex items-center justify-center shrink-0"><User className="w-8 h-8 text-vibrant-charcoal/30" /></div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-futura text-lg font-black uppercase text-mono-plum">{auth.name}</h4>
                    <p className="text-xs font-black text-vibrant-teal uppercase tracking-widest mb-2">{auth.position}</p>
                    <p className="text-sm text-vibrant-charcoal/70 line-clamp-2">{auth.description || auth.bio || auth.about}</p>
                    {auth.socialLinks?.length > 0 && (
                      <div className="mt-3 flex gap-3 flex-wrap">
                        {auth.socialLinks.map((link, lIdx) => (
                          <a key={lIdx} href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-vibrant-violet hover:underline truncate max-w-[200px] block">{link}</a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Edit opinion modal ───────────────────────────────────────────────────────
export function OpinionEditModal({ opinion, authors = [], onClose, onSaved }) {
  const [form, setForm] = useState({
    title: opinion?.title || "",
    description: opinion?.description || "",
    dateAndTime: opinion?.dateAndTime || "",
    tag: opinion?.tag || "",
    centerTag: opinion?.centerTag || "",
  });
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
  const [imagePreview, setImagePreview] = useState(opinion?.imageUrl || null);
  const [imageBase64, setImageBase64] = useState("");
  const [imageUrl, setImageUrl] = useState("");       // set when picking from library
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with opinion prop whenever it changes
  useEffect(() => {
    if (opinion) {
      setForm({
        title: opinion.title || "",
        description: opinion.description || "",
        dateAndTime: opinion.dateAndTime || "",
        tag: opinion.tag || "",
        centerTag: opinion.centerTag || "",
      });
      setSelectedAuthorIds(
        opinion.authors && opinion.authors.length > 0
          ? opinion.authors.map(a => a.id)
          : []
      );
      setImagePreview(opinion.imageUrl || null);
      setImageBase64("");
      setImageUrl("");
    }
  }, [opinion]);

  if (!opinion) return null;

  const clearCover = () => { setImagePreview(null); setImageBase64(""); setImageUrl(""); };

  const handleAddAuthor = (id) => {
    if (id && !selectedAuthorIds.includes(id)) {
      setSelectedAuthorIds([...selectedAuthorIds, id]);
    }
  };

  const handleRemoveAuthor = (id) => {
    setSelectedAuthorIds(selectedAuthorIds.filter(item => item !== id));
  };

  const handleSave = async () => {
    if (selectedAuthorIds.length === 0) {
      alert("Please select at least one author.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/opinions-manage/${opinion._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dateAndTime: form.dateAndTime,
          tag: form.tag,
          centerTag: form.centerTag,
          authors: selectedAuthorIds,
          imageBase64: imageBase64 || null,
          imageUrl: !imageBase64 ? imageUrl : null,
        }),
      });
      if (res.ok) { await onSaved(); onClose(); }
      else { const e = await res.json(); alert("Update failed: " + e.error); }
    } catch (e) { console.error(e); alert("Error updating opinion."); }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl max-h-[95vh] flex flex-col">
        <div className="p-8 border-b-2 border-vibrant-gray flex justify-between items-center bg-vibrant-offwhite sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-vibrant-violet/10 rounded-xl"><Edit className="w-5 h-5 text-vibrant-violet" /></div>
            <h2 className="font-futura text-2xl font-black uppercase text-mono-plum">Edit Opinion</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum shadow-sm"><X className="w-7 h-7" /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none md:col-span-2 text-black font-semibold" />
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-2">Description (Rich Text)</label>
              <RichTextEditor value={form.description} onChange={html => setForm({ ...form, description: html })} placeholder="Edit the description..." />
            </div>
            <input type="text" placeholder="Date & Time" value={form.dateAndTime} onChange={e => setForm({ ...form, dateAndTime: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold" />
            <select value={form.centerTag} onChange={e => setForm({ ...form, centerTag: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none font-semibold">
              <option value="">No Center</option>
              {PREDEFINED_CENTERS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none md:col-span-2 font-semibold">
              <option value="">No Tag</option>
              {PREDEFINED_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              {form.tag && !PREDEFINED_TAGS.includes(form.tag) && <option value={form.tag}>{form.tag} (Custom)</option>}
            </select>

            {/* Multiple Authors Selection Dropdown & Chips */}
            <div className="flex flex-col gap-3 w-full md:col-span-2 pt-4 border-t-2 border-vibrant-gray">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Select Authors *</label>
              <select
                value=""
                onChange={e => { handleAddAuthor(e.target.value); }}
                className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none font-semibold text-vibrant-charcoal cursor-pointer"
              >
                <option value="">-- Add an Author --</option>
                {authors.map(author => (
                  <option key={author._id} value={author._id} disabled={selectedAuthorIds.includes(author._id)}>
                    {author.authorName} ({author.authorPosition})
                  </option>
                ))}
              </select>

              {/* Selected Authors Chips */}
              {selectedAuthorIds.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {selectedAuthorIds.map(id => {
                    const author = authors.find(a => a._id === id);
                    if (!author) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 bg-mono-plum/10 border-2 border-mono-plum text-mono-plum px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-in scale-in duration-200">
                        <img
                          src={author.authorImage || author.authorPictureLink || author.profilePictureUrl || "/pictures/opinionMockup.jpg"}
                          alt={author.authorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{author.authorName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(id)}
                          className="w-4 h-4 rounded-full bg-mono-plum text-white flex items-center justify-center font-bold text-[8px] hover:bg-red-500 transition-colors ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-2 border-t-2 border-vibrant-gray">
              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden border-2 border-mono-plum mb-4 group">
                  <img src={imagePreview} alt="Cover" className="w-full h-48 object-cover" />
                  <button onClick={clearCover} className="absolute top-3 right-3 p-2 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-lg border-2 border-white"><X className="w-5 h-5" /></button>
                  {!imageBase64 && imageUrl && (
                    <span className="absolute bottom-2 left-2 bg-vibrant-violet text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">From Library</span>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-vibrant-offwhite text-mono-plum rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs uppercase tracking-widest border-2 border-vibrant-gray w-max"
              >
                <ImageIcon className="w-4 h-4" /> {imagePreview ? "Change Cover Image" : "Attach Cover Image"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 border-t-2 border-vibrant-gray bg-vibrant-offwhite flex justify-end gap-4 sticky bottom-0">
          <button onClick={onClose} className="px-8 py-4 border-2 border-vibrant-gray text-vibrant-charcoal/60 rounded-2xl hover:border-mono-plum hover:text-mono-plum transition-all font-black text-sm uppercase tracking-widest">Cancel</button>
          <button onClick={handleSave} disabled={isSubmitting} className="flex items-center gap-2 px-10 py-4 bg-vibrant-violet text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-mono-plum transition-all shadow-xl shadow-vibrant-violet/20 disabled:opacity-50">
            <Save className="w-5 h-5" /> {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <ImagePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={({ url, base64 }) => {
          setImagePreview(url);
          setImageBase64(base64 || "");
          setImageUrl(base64 ? "" : url);
        }}
      />
    </div>
  );
}

// ── Downloadable PDF Link Modal ──────────────────────────────────────────────
export function DownloadableLinkModal({ opinion, onClose, onSaved }) {
  const [link, setLink] = useState(opinion?.downloadableLink || "");
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with opinion prop whenever it changes
  useEffect(() => {
    if (opinion) {
      setLink(opinion.downloadableLink || "");
    }
  }, [opinion]);

  if (!opinion) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/opinions-manage/${opinion._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          downloadableLink: link,
        }),
      });
      if (res.ok) {
        await onSaved();
        onClose();
      } else {
        const e = await res.json();
        alert("Failed to update link: " + e.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error updating link.");
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden border-4 border-mono-plum shadow-2xl">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center border-b-2 border-vibrant-gray pb-4">
            <h3 className="font-futura text-xl font-black uppercase text-mono-plum">Add Downloadable Link</h3>
            <button onClick={onClose} className="p-2 hover:bg-vibrant-offwhite rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-vibrant-charcoal/70">
              Update the downloadable PDF link for the opinion: <br />
              <strong className="text-mono-plum">{opinion.title}</strong>
            </p>
            <input
              type="url"
              placeholder="https://example.com/opinion.pdf"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full text-black p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none font-semibold"
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button onClick={onClose} className="px-6 py-4 border-2 border-vibrant-gray text-vibrant-charcoal/60 rounded-2xl hover:border-mono-plum hover:text-mono-plum transition-all font-black text-xs uppercase tracking-widest flex-1">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-4 bg-vibrant-violet text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-mono-plum transition-all shadow-xl shadow-vibrant-violet/20 disabled:opacity-50 flex-1"
            >
              {isSaving ? "Saving..." : "Save Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

