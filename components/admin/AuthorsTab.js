"use client";
import { useState } from "react";
import { Plus, X, Send, Image as ImageIcon, Edit, Trash2, Save, User, Globe, Eye } from "lucide-react";

// ── Image Upload Hook ────────────────────────────────────────────────────────
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

// ── Create Author Form ───────────────────────────────────────────────────────
function CreateAuthorForm({ onCreated }) {
  const [form, setForm] = useState({ authorName: "", authorPosition: "", about: "", socialLinks: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatar = useImageUpload();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.authorName || !form.authorPosition) {
      alert("Please fill in the Author Name and Position.");
      return;
    }
    setIsSubmitting(true);
    try {
      const socialLinksArray = form.socialLinks
        ? form.socialLinks.split(",").map((l) => l.trim()).filter(Boolean)
        : [];

      const res = await fetch("/api/admin/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: form.authorName,
          authorPosition: form.authorPosition,
          about: form.about, // Consolidated biography
          socialLinks: socialLinksArray,
          authorImage: avatar.base64 || "", // Consolidated picture
        }),
      });

      const data = await res.json();
      if (data.success) {
        setForm({ authorName: "", authorPosition: "", bio: "", socialLinks: "" });
        avatar.clear();
        onCreated();
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create author.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-mono-plum rounded-[2.5rem] p-10 shadow-[12px_12px_0px_#8B5CF6]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-vibrant-violet/10 rounded-xl">
          <Plus className="w-6 h-6 text-vibrant-violet" />
        </div>
        <h2 className="font-futura text-2xl font-black uppercase text-mono-plum">Create New Author Profile</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Author Name *</label>
          <input
            required
            type="text"
            placeholder="e.g. Dr. Arvan Singh"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Position / Title *</label>
          <input
            required
            type="text"
            placeholder="e.g. Distinguished Fellow, PPF"
            value={form.authorPosition}
            onChange={(e) => setForm({ ...form, authorPosition: e.target.value })}
            className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Biography / Description</label>
          <textarea
            placeholder="Write a brief bio about the author..."
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            className="w-full min-h-[120px] p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold resize-none"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Social Media Links (Comma separated URLs)</label>
          <input
            type="text"
            placeholder="https://linkedin.com/in/username, https://twitter.com/username"
            value={form.socialLinks}
            onChange={(e) => setForm({ ...form, socialLinks: e.target.value })}
            className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold"
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <label className="flex items-center gap-3 px-6 py-4 bg-vibrant-offwhite text-mono-plum rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs uppercase tracking-widest border-2 border-vibrant-gray w-max">
            <User className="w-4 h-4" /> Upload Profile Picture
            <input type="file" className="hidden" accept="image/*" onChange={avatar.handle} />
          </label>
          {avatar.preview && (
            <div className="mt-4 relative w-24 h-24 rounded-full overflow-hidden border-2 border-mono-plum group">
              <img src={avatar.preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={avatar.clear}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-mono-plum text-white rounded-2xl font-black uppercase tracking-widest text-base hover:bg-vibrant-violet transition-all shadow-xl shadow-mono-plum/20 active:translate-y-1 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Create Author Profile"} <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Edit Author Modal ────────────────────────────────────────────────────────
function EditAuthorModal({ author, onClose, onSaved }) {
  const [form, setForm] = useState({
    authorName: author?.authorName || "",
    authorPosition: author?.authorPosition || "",
    about: author?.about || author?.bio || "",
    socialLinks: author?.socialLinks ? author.socialLinks.join(", ") : "",
    authorImage: author?.authorImage || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const avatar = useImageUpload();

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const socialLinksArray = form.socialLinks
        ? form.socialLinks.split(",").map((l) => l.trim()).filter(Boolean)
        : [];

      const res = await fetch(`/api/admin/authors/${author._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: form.authorName,
          authorPosition: form.authorPosition,
          about: form.about, // Consolidated biography
          socialLinks: socialLinksArray,
          authorImage: avatar.base64 ? avatar.base64 : form.authorImage, // Consolidated picture
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
        onClose();
      } else {
        alert("Error saving: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save updates.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-8 border-b-2 border-vibrant-gray flex justify-between items-center bg-vibrant-offwhite sticky top-0 z-10">
          <h2 className="font-futura text-2xl font-black uppercase text-mono-plum">Edit Author Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Author Name *</label>
              <input
                required
                type="text"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Position / Title *</label>
              <input
                required
                type="text"
                value={form.authorPosition}
                onChange={(e) => setForm({ ...form, authorPosition: e.target.value })}
                className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Biography / Description</label>
              <textarea
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                className="w-full min-h-[120px] p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold resize-none"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50">Social Media Links</label>
              <input
                type="text"
                value={form.socialLinks}
                onChange={(e) => setForm({ ...form, socialLinks: e.target.value })}
                className="w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-black font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-vibrant-charcoal/50 mb-2 block">Profile Picture</label>
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-mono-plum">
                  <img
                    src={avatar.preview || form.authorImage || "/pictures/opinionMockup.jpg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="flex items-center gap-3 px-6 py-4 bg-vibrant-offwhite text-mono-plum rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs uppercase tracking-widest border-2 border-vibrant-gray">
                  <ImageIcon className="w-4 h-4" /> Change Photo
                  <input type="file" className="hidden" accept="image/*" onChange={avatar.handle} />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t-2 border-vibrant-gray">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 border-2 border-vibrant-gray text-vibrant-charcoal/60 rounded-2xl hover:border-mono-plum hover:text-mono-plum transition-all font-black text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-10 py-4 bg-mono-plum text-white rounded-2xl hover:bg-vibrant-violet transition-all font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── View Author Modal ────────────────────────────────────────────────────────
function ViewAuthorModal({ author, onClose }) {
  if (!author) return null;
  const opinionsCount = author.opinionsWritten ? author.opinionsWritten.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-8 border-b-2 border-vibrant-gray flex justify-between items-center bg-vibrant-offwhite sticky top-0 z-10">
          <h2 className="font-futura text-2xl font-black uppercase text-mono-plum">Author Profile Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Identity details */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-vibrant-offwhite p-6 rounded-[2rem] border-2 border-vibrant-gray shadow-inner">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              <img
                src={author.authorImage || author.authorPictureLink || author.profilePictureUrl || "/pictures/opinionMockup.jpg"}
                alt={author.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-futura text-2xl font-black uppercase text-mono-plum leading-none">{author.authorName}</h3>
              <p className="text-xs font-black text-vibrant-teal uppercase tracking-widest leading-none">
                {author.authorPosition}
              </p>
              <div className="flex gap-2 items-center text-vibrant-violet">
                <Globe size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {author.socialLinks?.length || 0} Social Links
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Biography / About</h4>
            <div className="bg-white p-6 rounded-2xl border-2 border-vibrant-gray text-vibrant-charcoal/80 leading-relaxed text-base whitespace-pre-wrap">
              {author.about || author.bio || "No biography provided yet."}
            </div>
          </div>

          {/* Social Links details */}
          {author.socialLinks && author.socialLinks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Social Networks</h4>
              <div className="flex flex-col gap-2 bg-vibrant-offwhite p-4 rounded-2xl border border-vibrant-gray">
                {author.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-vibrant-violet hover:underline truncate block"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Opinions Written list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Published Articles ({opinionsCount})</h4>
            </div>
            {opinionsCount > 0 ? (
              <div className="divide-y-2 divide-vibrant-gray border-2 border-vibrant-gray rounded-2xl overflow-hidden bg-white max-h-60 overflow-y-auto">
                {author.opinionsWritten.map((opinion, idx) => (
                  <div key={opinion._id || idx} className="p-5 hover:bg-vibrant-offwhite/50 transition-all flex justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-mono-plum text-base mb-1">{opinion.title}</p>
                      {opinion.tag && (
                        <span className="text-[10px] font-black text-vibrant-violet bg-vibrant-violet/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {opinion.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-vibrant-charcoal/30 flex-shrink-0">
                      ID: {opinion.opinionId || "Legacy"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-vibrant-gray text-center text-vibrant-charcoal/40 text-sm font-semibold">
                This author has not published any opinions yet.
              </div>
            )}
          </div>
        </div>
        <div className="p-8 border-t-2 border-vibrant-gray bg-vibrant-offwhite flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-4 bg-mono-plum text-white rounded-2xl hover:bg-vibrant-violet transition-all font-black text-xs uppercase tracking-widest shadow-xl"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Authors List Table ───────────────────────────────────────────────────────
function AuthorsList({ authors, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white border-2 border-mono-plum rounded-[2.5rem] overflow-hidden shadow-xl">
      <div className="px-10 py-6 bg-vibrant-offwhite border-b-2 border-vibrant-gray flex items-center justify-between">
        <h3 className="font-futura text-base font-black uppercase tracking-[0.15em] text-vibrant-charcoal/60">
          Registered Authors ({authors.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-vibrant-offwhite/50 border-b-2 border-vibrant-gray">
              <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Author Profile</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Biography Snippet</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Opinions Written</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-vibrant-gray">
            {authors.map((author) => {
              const opinionsCount = author.opinionsWritten ? author.opinionsWritten.length : 0;
              return (
                <tr key={author._id} className="hover:bg-vibrant-offwhite/50 transition-colors">
                  <td className="px-10 py-8 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 shadow-inner">
                      <img
                        src={author.authorImage || author.authorPictureLink || author.profilePictureUrl || "/pictures/opinionMockup.jpg"}
                        alt={author.authorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xl text-mono-plum font-bold mb-1">{author.authorName}</p>
                      <p className="text-[10px] font-black text-vibrant-teal uppercase tracking-widest">
                        {author.authorPosition}
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-8 max-w-[280px]">
                    <p className="text-sm font-semibold text-vibrant-charcoal/70 line-clamp-2 leading-relaxed">
                      {author.about || author.bio || "No biography provided yet."}
                    </p>
                    {author.socialLinks && author.socialLinks.length > 0 && (
                      <div className="flex gap-2 mt-2 items-center text-vibrant-violet">
                        <Globe size={12} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          {author.socialLinks.length} Social Links
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-mono-plum">{opinionsCount}</span>
                      <span className="text-xs uppercase font-black text-vibrant-charcoal/40 tracking-wider">
                        {opinionsCount === 1 ? "article" : "articles"}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => onView(author)}
                        className="flex items-center gap-2 p-4 bg-white border-2 border-vibrant-gray rounded-2xl hover:border-vibrant-teal hover:bg-vibrant-teal hover:text-white transition-all text-sm uppercase px-5 font-bold"
                      >
                        <Eye className="w-5 h-5" /> View
                      </button>
                      <button
                        onClick={() => onEdit(author)}
                        className="flex items-center gap-2 p-4 bg-white border-2 border-vibrant-gray rounded-2xl hover:border-vibrant-violet hover:bg-vibrant-violet hover:text-white transition-all text-sm uppercase px-5 font-bold"
                      >
                        <Edit className="w-5 h-5" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${author.authorName}? This will not delete their opinions but will remove the author links.`)) {
                            onDelete(author._id);
                          }
                        }}
                        className="flex items-center gap-2 p-4 bg-white border-2 border-red-200 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-sm uppercase px-5 font-bold"
                      >
                        <Trash2 className="w-5 h-5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export default function AuthorsTab({ authors, onRefetch }) {
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [viewingAuthor, setViewingAuthor] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/authors/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefetch();
      } else {
        alert("Failed to delete author.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting author.");
    }
  };

  return (
    <div className="space-y-10">
      <CreateAuthorForm onCreated={onRefetch} />
      {authors && authors.length > 0 ? (
        <AuthorsList
          authors={authors}
          onView={setViewingAuthor}
          onEdit={setEditingAuthor}
          onDelete={handleDelete}
        />
      ) : (
        <div className="bg-white border-2 border-mono-plum rounded-[2.5rem] p-16 text-center shadow-lg">
          <User size={48} className="mx-auto text-vibrant-charcoal/20 mb-4" />
          <h4 className="font-futura text-xl font-black text-mono-plum uppercase tracking-wider mb-2">
            No Authors Found
          </h4>
          <p className="text-sm font-semibold text-vibrant-charcoal/50 max-w-sm mx-auto">
            Use the form above to add your first policy expert or guest contributor to the database!
          </p>
        </div>
      )}

      {viewingAuthor && (
        <ViewAuthorModal
          author={viewingAuthor}
          onClose={() => setViewingAuthor(null)}
        />
      )}

      {editingAuthor && (
        <EditAuthorModal
          author={editingAuthor}
          onClose={() => setEditingAuthor(null)}
          onSaved={onRefetch}
        />
      )}
    </div>
  );
}
