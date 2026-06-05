"use client";
import { useState, useRef } from "react";
import { Plus, X, Send, Image as ImageIcon, Eye, Edit, Trash2, GripVertical, ArrowUpDown, Save, User, Link, Search } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { PREDEFINED_TAGS, PREDEFINED_CENTERS } from "./constants";
import ImagePickerModal from "./ImagePickerModal";

// ksjdlkjdsl

// ── Shared image upload util ─────────────────────────────────────────────────
function useImageUpload() {
  const [preview, setPreview] = useState(null);
  const [base64, setBase64] = useState("");
  const handle = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setBase64(reader.result);
    reader.readAsDataURL(file);
  };
  const clear = () => { setPreview(null); setBase64(""); };
  return { preview, base64, handle, clear, setPreview, setBase64 };
}

// ── Create Opinion Form ──────────────────────────────────────────────────────
function CreateOpinionForm({ authors = [], onSwitchToAuthorsTab, onCreated }) {
  const [form, setForm] = useState({ title: "", description: "", dateAndTime: "", tag: "", centerTag: "" });
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
  const [isCustomTag, setIsCustomTag] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Cover image — either a new upload (base64) or a library pick (url only)
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverBase64, setCoverBase64] = useState("");
  const [coverUrl, setCoverUrl] = useState("");       // set when picking from library
  const [pickerOpen, setPickerOpen] = useState(false);

  const clearCover = () => { setCoverPreview(null); setCoverBase64(""); setCoverUrl(""); };

  const handleAddAuthor = (id) => {
    if (id && !selectedAuthorIds.includes(id)) {
      setSelectedAuthorIds([...selectedAuthorIds, id]);
    }
  };

  const handleRemoveAuthor = (id) => {
    setSelectedAuthorIds(selectedAuthorIds.filter(item => item !== id));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || selectedAuthorIds.length === 0) {
      alert("Please fill in the Title, Description, and select at least one Author.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/opinions-manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dateAndTime: form.dateAndTime || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          tag: form.tag,
          centerTag: form.centerTag,
          author: { id: selectedAuthorIds[0] }, // Direct link to author via ID
          authors: selectedAuthorIds,
          // Send base64 for new upload, or existing url for library pick
          imageBase64: coverBase64 || null,
          imageUrl: !coverBase64 ? coverUrl : null,
        }),
      });
      if (res.ok) {
        setForm({ title: "", description: "", dateAndTime: "", tag: "", centerTag: "" });
        setSelectedAuthorIds([]);
        clearCover();
        onCreated();
      } else {
        const err = await res.json();
        alert("Error creating opinion: " + err.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to post opinion.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border-2 border-mono-plum rounded-[2.5rem] p-10 shadow-[12px_12px_0px_#8B5CF6]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-vibrant-violet/10 rounded-xl"><Plus className="w-6 h-6 text-vibrant-violet" /></div>
        <h2 className="font-futura text-2xl font-black uppercase text-mono-plum">Create Admin Opinion</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none md:col-span-2 text-black font-semibold" />
        <div className="md:col-span-2">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-2">Description (Rich Text)</label>
          <RichTextEditor value={form.description} onChange={html => setForm({ ...form, description: html })} placeholder="Write the opinion description here..." />
        </div>
        <input type="text" placeholder="Date & Time (e.g. April 18, 2026)" value={form.dateAndTime} onChange={e => setForm({ ...form, dateAndTime: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold" />
        <select value={form.centerTag} onChange={e => setForm({ ...form, centerTag: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none font-semibold text-vibrant-charcoal">
          <option value="" disabled>Select a Center (Optional)</option>
          {PREDEFINED_CENTERS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <div className="flex flex-col gap-2 w-full">
          <select value={isCustomTag ? "Other" : (form.tag || "")} onChange={e => { if (e.target.value === "Other") { setIsCustomTag(true); setForm({ ...form, tag: "" }); } else { setIsCustomTag(false); setForm({ ...form, tag: e.target.value }); } }} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none font-semibold text-vibrant-charcoal">
            <option value="" disabled>Select a Tag</option>
            {PREDEFINED_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="Other">Other (Custom)</option>
          </select>
          {isCustomTag && <input type="text" placeholder="Enter Custom Tag" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none mt-2 text-black font-semibold" />}
        </div>

        {/* Multiple Authors Select dropdown */}
        <div className="flex flex-col gap-3 w-full md:col-span-2">
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
      </div>

      {coverPreview && (
        <div className="mt-6 relative rounded-[2rem] overflow-hidden border-2 border-mono-plum group">
          <img src={coverPreview} alt="Preview" className="w-full h-64 object-cover" />
          <button onClick={clearCover} className="absolute top-4 right-4 p-3 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-xl border-2 border-white"><X className="w-6 h-6" /></button>
          {!coverBase64 && (
            <span className="absolute bottom-3 left-3 bg-vibrant-violet text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">From Library</span>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-6">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-vibrant-offwhite text-mono-plum rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-sm uppercase tracking-widest border-2 border-vibrant-gray font-bold"
        >
          <ImageIcon className="w-5 h-5" /> {coverPreview ? "Change Image" : "Attach Image"}
        </button>
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-mono-plum text-white rounded-2xl font-black uppercase tracking-widest text-base hover:bg-vibrant-violet transition-all shadow-xl shadow-mono-plum/20 active:translate-y-1 disabled:opacity-50">
          {isSubmitting ? "Posting..." : "Post Opinion"} <Send className="w-5 h-5" />
        </button>
      </div>

      <ImagePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={({ url, base64 }) => {
          setCoverPreview(url);
          setCoverBase64(base64 || "");
          setCoverUrl(base64 ? "" : url);
        }}
      />
    </div>
  );
}

// ── Opinions List with Drag-and-Drop Reorder ─────────────────────────────────
function OpinionsList({ opinions, onView, onEdit, onDelete, onReorder, onAddLink }) {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reordered, setReordered] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dragItem = useRef(null);

  const enterReorder = () => { setReordered([...opinions]); setIsReorderMode(true); };
  const cancelReorder = () => { setIsReorderMode(false); setReordered([]); };

  const handleDragStart = (i) => { dragItem.current = i; };
  const handleDragEnter = (i) => {
    const updated = [...reordered];
    const dragged = updated.splice(dragItem.current, 1)[0];
    updated.splice(i, 0, dragged);
    dragItem.current = i;
    setReordered(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/opinions-manage/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reordered.map(op => op._id) }),
      });
      if (res.ok) { await onReorder(); setIsReorderMode(false); setReordered([]); }
      else { const e = await res.json(); alert("Failed: " + e.error); }
    } catch (e) { console.error(e); alert("Error saving order."); }
    setIsSaving(false);
  };

  const filteredOpinions = opinions.filter((opinion) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = opinion.title?.toLowerCase().includes(query);
    const dateMatch = opinion.dateAndTime?.toLowerCase().includes(query);
    const tagMatch = opinion.tag?.toLowerCase().includes(query);
    const centerMatch = opinion.centerTag?.toLowerCase().includes(query);
    const authorMatch = opinion.authors?.some(auth => 
      auth.name?.toLowerCase().includes(query) || 
      auth.position?.toLowerCase().includes(query)
    );
    return titleMatch || dateMatch || tagMatch || centerMatch || authorMatch;
  });

  const list = isReorderMode ? reordered : filteredOpinions;

  return (
    <div className="bg-white border-2 border-mono-plum rounded-[2.5rem] overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-10 py-6 bg-vibrant-offwhite border-b-2 border-vibrant-gray">
        <h3 className="font-futura text-base font-black uppercase tracking-[0.15em] text-vibrant-charcoal/60">
          {isReorderMode 
            ? "Drag rows to reorder — then save" 
            : searchQuery
              ? `${filteredOpinions.length} of ${opinions.length} Opinion${opinions.length !== 1 ? "s" : ""} found`
              : `${opinions.length} Opinion${opinions.length !== 1 ? "s" : ""}`}
        </h3>
        <div className="flex items-center gap-3">
          {isReorderMode ? (
            <>
              <button onClick={cancelReorder} className="flex items-center gap-2 px-5 py-2.5 border-2 border-vibrant-gray text-vibrant-charcoal/60 rounded-xl hover:border-mono-plum hover:text-mono-plum transition-all text-xs font-black uppercase tracking-widest">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-vibrant-violet text-white rounded-xl hover:bg-mono-plum transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-vibrant-violet/20 disabled:opacity-50">
                <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Order"}
              </button>
            </>
          ) : (
            <button
              onClick={enterReorder}
              disabled={!!searchQuery}
              className={`flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
                searchQuery
                  ? "border-vibrant-gray text-vibrant-charcoal/30 cursor-not-allowed opacity-50"
                  : "border-mono-plum text-mono-plum hover:bg-mono-plum hover:text-white"
              }`}
              title={searchQuery ? "Clear search to reorder opinions" : "Reorder opinions"}
            >
              <ArrowUpDown className="w-4 h-4" /> Reorder
            </button>
          )}
        </div>
      </div>

      {!isReorderMode && (
        <div className="px-10 py-4 bg-white border-b-2 border-vibrant-gray flex items-center relative">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search by title, author, date, tag or center..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold text-sm transition-all"
            />
            <Search className="w-5 h-5 text-vibrant-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-vibrant-charcoal/40 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-vibrant-gray/50 animate-in fade-in zoom-in duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-vibrant-offwhite/50 border-b-2 border-vibrant-gray">
              {isReorderMode && <th className="pl-6 py-6 w-10" />}
              <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Opinion Details</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Author</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-vibrant-gray">
            {list.length === 0 ? (
              <tr>
                <td colSpan={isReorderMode ? 4 : 3} className="px-10 py-16 text-center text-vibrant-charcoal/40">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-vibrant-offwhite rounded-full">
                      <Search className="w-8 h-8 text-vibrant-charcoal/30 animate-pulse" />
                    </div>
                    <p className="text-lg font-black uppercase tracking-wider text-mono-plum">No opinions found</p>
                    <p className="text-sm font-semibold max-w-xs mx-auto">We couldn&#39;t find any opinions matching &quot;{searchQuery}&quot; . Try using different terms or check for typos.</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 px-5 py-2.5 bg-mono-plum text-white rounded-xl hover:bg-vibrant-violet transition-all text-xs font-black uppercase tracking-widest shadow-md shadow-mono-plum/20"
                    >
                      Clear Search
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((opinion, index) => (
                <tr
                  key={opinion._id}
                  draggable={isReorderMode}
                  onDragStart={isReorderMode ? () => handleDragStart(index) : undefined}
                  onDragEnter={isReorderMode ? () => handleDragEnter(index) : undefined}
                  onDragOver={isReorderMode ? (e) => e.preventDefault() : undefined}
                  className={`transition-colors ${isReorderMode ? "cursor-grab active:cursor-grabbing hover:bg-vibrant-violet/5" : "hover:bg-vibrant-offwhite/50"}`}
                >
                  {isReorderMode && (
                    <td className="pl-6 py-8">
                      <div className="flex flex-col items-center gap-1 text-vibrant-charcoal/30">
                        <GripVertical className="w-5 h-5" />
                        <span className="text-[10px] font-black tabular-nums">{index + 1}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-10 py-8 flex gap-4 items-center">
                    {opinion.imageUrl && <img src={opinion.imageUrl} alt="Poster" className="w-16 h-16 rounded-xl object-cover" />}
                    <div>
                      <p className="text-xl text-mono-plum mb-1">{opinion.title}</p>
                      <p className="text-sm text-vibrant-charcoal/40 uppercase tracking-widest">Date: {opinion.dateAndTime}</p>
                    </div>
                  </td>
                   <td className="px-10 py-8">
                    {opinion.authors && opinion.authors.length > 0 ? (
                      <div className="space-y-1">
                        {opinion.authors.map((auth, idx) => (
                          <div key={idx} className="border-b last:border-0 border-vibrant-gray pb-1 last:pb-0">
                            <p className="text-base font-black text-mono-plum leading-tight">{auth.name}</p>
                            <p className="text-[10px] font-black text-vibrant-teal uppercase tracking-widest">{auth.position}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base font-black text-vibrant-charcoal/30">No Authors</p>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-end gap-3 flex-wrap">
                      {!isReorderMode ? (
                        <>
                          <button onClick={() => onView(opinion)} className="flex items-center gap-2 p-3 bg-white border-2 border-vibrant-gray rounded-xl hover:border-vibrant-teal hover:bg-vibrant-teal hover:text-white transition-all text-xs uppercase px-4"><Eye className="w-4 h-4" /> View</button>
                          <button onClick={() => onEdit(opinion)} className="flex items-center gap-2 p-3 bg-white border-2 border-vibrant-gray rounded-xl hover:border-vibrant-violet hover:bg-vibrant-violet hover:text-white transition-all text-xs uppercase px-4"><Edit className="w-4 h-4" /> Edit</button>
                          <button onClick={() => onAddLink(opinion)} className="flex items-center gap-2 p-3 bg-white border-2 border-vibrant-gray rounded-xl hover:border-mono-plum hover:bg-mono-plum hover:text-white transition-all text-xs uppercase px-4">
                            <Link className="w-4 h-4" />
                            {opinion.downloadableLink ? "Edit PDF Link" : "Add PDF Link"}
                          </button>
                          <button onClick={() => onDelete(opinion._id)} className="flex items-center gap-2 p-3 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase px-4"><Trash2 className="w-4 h-4" /> Delete</button>
                        </>
                      ) : (
                        <span className="text-xs font-black text-vibrant-charcoal/30 uppercase tracking-widest pr-2">Drag to reorder</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main OpinionsTab export ──────────────────────────────────────────────────
export default function OpinionsTab({ opinions, authors, onSwitchToAuthorsTab, onRefetch, onView, onEdit, onDelete, onAddLink }) {
  return (
    <div className="space-y-10">
      <CreateOpinionForm authors={authors} onSwitchToAuthorsTab={onSwitchToAuthorsTab} onCreated={onRefetch} />
      <OpinionsList opinions={opinions} onView={onView} onEdit={onEdit} onDelete={onDelete} onReorder={onRefetch} onAddLink={onAddLink} />
    </div>
  );
}
