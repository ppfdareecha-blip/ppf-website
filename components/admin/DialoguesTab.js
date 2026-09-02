import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Send, Image as ImageIcon, Eye, Trash2, Pencil, Search, FileText } from "lucide-react";

export default function DialoguesTab() {
  const [dialogues, setDialogues] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "", pdfLink: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [reportPdfBase64, setReportPdfBase64] = useState("");
  const [reportPdfFileName, setReportPdfFileName] = useState("");
  const [existingReportPdfUrl, setExistingReportPdfUrl] = useState("");
  const [clearReportPdf, setClearReportPdf] = useState(false);
  const [clearImage, setClearImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDialogueId, setEditingDialogueId] = useState(null);
  const [dialogueToDelete, setDialogueToDelete] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDialogues = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/dialogues");
      const data = await res.json();
      if (data.success) {
        setDialogues(data.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    fetchDialogues();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 3MB.");
      e.target.value = "";
      return;
    }
    setClearImage(false);
    setImagePreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("PDF is too large. Please select a PDF under 3MB.");
      e.target.value = "";
      return;
    }
    setReportPdfFileName(file.name);
    setClearReportPdf(false);
    const reader = new FileReader();
    reader.onloadend = () => setReportPdfBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const url = editingDialogueId ? `/api/admin/dialogues/${editingDialogueId}` : "/api/admin/dialogues";
      const method = editingDialogueId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageBase64, reportPdfBase64, clearReportPdf, clearImage }),
      });
      if (res.ok) {
        setForm({ title: "", description: "", date: "", pdfLink: "" });
        setImagePreview(null);
        setImageBase64("");
        setReportPdfBase64("");
        setReportPdfFileName("");
        setExistingReportPdfUrl("");
        setClearReportPdf(false);
        setClearImage(false);
        setEditingDialogueId(null);
        fetchDialogues();
      } else {
        if (res.status === 413) {
          alert("Error: The uploaded file is too large. Please use files under 3MB.");
        } else {
          try {
            const errorData = await res.json();
            alert(`Failed to save dialogue: ${errorData.error || res.statusText}`);
          } catch (jsonError) {
            const errorText = await res.text();
            if (errorText.includes("Request Entity Too Large")) {
              alert("Error: The uploaded file is too large. Please use files under 3MB.");
            } else {
              alert(`Failed to save dialogue (Status ${res.status}): ${res.statusText}`);
            }
          }
        }
      }
    } catch (e) { 
      console.error(e); 
      alert(`Error saving dialogue: ${e.message}`);
    }
    setIsSubmitting(false);
  };

  const handleEditClick = (dialogue) => {
    setEditingDialogueId(dialogue._id);
    setForm({
      title: dialogue.title || "",
      description: dialogue.description || "",
      date: dialogue.date || "",
      pdfLink: dialogue.pdfLink || ""
    });
    setImagePreview(dialogue.image || null);
    setImageBase64("");
    setReportPdfBase64("");
    setReportPdfFileName(dialogue.reportPdf ? "Existing PDF" : "");
    setExistingReportPdfUrl(dialogue.reportPdf || "");
    setClearReportPdf(false);
    setClearImage(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingDialogueId(null);
    setForm({ title: "", description: "", date: "", pdfLink: "" });
    setImagePreview(null);
    setImageBase64("");
    setReportPdfBase64("");
    setReportPdfFileName("");
    setExistingReportPdfUrl("");
    setClearReportPdf(false);
    setClearImage(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/admin/dialogues/${id}`, { method: "DELETE" });
      fetchDialogues();
    } catch (e) {
      console.error(e);
      alert(`Error deleting dialogue: ${e.message}`);
    }
  };

  const handleView = (dialogue) => {
    const url = dialogue.reportPdf || dialogue.pdfLink;
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No PDF associated with this dialogue.");
    }
  };

  const filteredDialogues = dialogues.filter(d => {
    const query = searchQuery.toLowerCase();
    return !searchQuery || 
      d.title?.toLowerCase().includes(query) || 
      d.description?.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-10">
      {/* Create / Edit form */}
      <div className="bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-[8px_8px_0px_#8B5CF6] sm:shadow-[12px_12px_0px_#8B5CF6]">
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="p-2 sm:p-3 bg-vibrant-violet/10 rounded-xl">
            {editingDialogueId ? <Pencil className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" /> : <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" />}
          </div>
          <h2 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">
            {editingDialogueId ? "Edit Dialogue" : "Create New Dialogue"}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          <input type="text" placeholder="Dialogue Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base sm:col-span-2" />
          <input type="text" placeholder="Date (e.g., January - June 2022)" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base" />
          <input type="text" placeholder="PDF Link (Optional)" value={form.pdfLink} onChange={e => setForm({ ...form, pdfLink: e.target.value })} className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base" />
          <textarea placeholder="Brief description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full min-h-[100px] sm:min-h-[120px] p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base sm:col-span-2" />
        </div>

        {imagePreview && (
          <div className="mt-5 sm:mt-6 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 border-mono-plum group">
            <img src={imagePreview} alt="Preview" className="w-full h-40 sm:h-64 object-cover" />
            <button onClick={() => { setImagePreview(null); setImageBase64(""); setClearImage(true); }} className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 sm:p-3 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-xl border-2 border-white">
              <X className="w-4 sm:w-6 h-4 sm:h-6" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:gap-6 mt-5 sm:mt-10">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <label className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-vibrant-offwhite text-mono-plum rounded-xl sm:rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-vibrant-gray">
              <ImageIcon className="w-4 sm:w-5 h-4 sm:h-5" /> Attach Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <div className="flex-1 flex flex-col gap-2 relative">
              <label className="w-full flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-vibrant-offwhite text-mono-plum rounded-xl sm:rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-vibrant-gray relative">
                <FileText className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="truncate max-w-[200px]">{reportPdfFileName ? reportPdfFileName : "Upload PDF (Optional)"}</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
              {(existingReportPdfUrl || reportPdfBase64) && (
                <button
                  type="button"
                  onClick={() => {
                    setReportPdfBase64("");
                    setReportPdfFileName("");
                    setExistingReportPdfUrl("");
                    setClearReportPdf(true);
                  }}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md border-2 border-white z-10"
                  title="Clear PDF"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {existingReportPdfUrl && !reportPdfBase64 && (
                <a href={existingReportPdfUrl} target="_blank" rel="noopener noreferrer" className="text-center text-xs font-black uppercase text-vibrant-teal hover:underline flex items-center justify-center gap-1 mt-1">
                  <Eye className="w-3 h-3" /> View Current PDF
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {editingDialogueId && (
              <button onClick={handleCancelEdit} className="flex items-center justify-center px-5 sm:px-8 py-3 sm:py-5 bg-white border-2 border-mono-plum text-mono-plum rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-base hover:bg-vibrant-gray transition-all shadow-md">
                Cancel
              </button>
            )}
            <button onClick={handleSave} disabled={isSubmitting} className="flex items-center justify-center gap-2 sm:gap-3 flex-1 sm:flex-none px-5 sm:px-12 py-3 sm:py-5 bg-mono-plum text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-base hover:bg-vibrant-violet transition-all shadow-xl shadow-mono-plum/20 active:translate-y-1 disabled:opacity-50">
              {editingDialogueId ? (isSubmitting ? "Updating..." : "Update Dialogue") : (isSubmitting ? "Creating..." : "Create Dialogue")} <Send className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialogues list */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4 px-0">
        <h3 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">Manage Dialogues</h3>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 px-0">
        <input
          type="text"
          placeholder="Search dialogues..."
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

      {isLoading ? (
        <div className="text-center py-10">Loading dialogues...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDialogues.map((dialogue) => (
            <div key={dialogue._id} className="bg-white border-2 border-vibrant-gray rounded-xl overflow-hidden shadow-md flex flex-col">
              {dialogue.image ? (
                <img src={dialogue.image} alt={dialogue.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-bold text-mono-plum text-lg mb-1">{dialogue.title}</h4>
                <p className="text-xs text-slate-500 mb-3">{dialogue.date}</p>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">{dialogue.description}</p>
                <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                  <button onClick={() => handleView(dialogue)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-vibrant-teal text-white rounded-lg hover:bg-vibrant-teal/80 transition-all text-xs font-bold uppercase">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button onClick={() => handleEditClick(dialogue)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-vibrant-violet text-white rounded-lg hover:bg-vibrant-violet/80 transition-all text-xs font-bold uppercase">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setDialogueToDelete(dialogue)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-bold uppercase">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {dialogueToDelete && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-mono-plum text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-white shadow-xl">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="font-futura text-3xl font-black uppercase tracking-wide text-mono-plum mb-4">
                Delete Dialogue?
              </h3>
              <p className="text-vibrant-charcoal/70 mb-6 font-medium leading-relaxed text-lg px-2">
                You are about to permanently delete the dialogue: <br/>
                <span className="inline-block mt-4 px-4 py-3 bg-vibrant-offwhite border-2 border-vibrant-gray rounded-xl font-bold text-mono-plum shadow-inner">
                  {dialogueToDelete.title}
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button onClick={() => setDialogueToDelete(null)} className="flex-1 py-5 bg-white border-2 border-vibrant-gray text-vibrant-charcoal rounded-2xl font-black uppercase tracking-widest text-sm hover:border-mono-plum transition-all shadow-sm">
                  Cancel
                </button>
                <button onClick={() => { handleDelete(dialogueToDelete._id); setDialogueToDelete(null); }} className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all">
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
