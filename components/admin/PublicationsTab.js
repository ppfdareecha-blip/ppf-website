import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Send, Image as ImageIcon, Eye, Trash2, Pencil, Search, FileText } from "lucide-react";

export default function PublicationsTab({ publications = [], onDelete, onRefetch }) {
  const defaultForm = {
    title: "",
    publicationType: "researchReport",
    author: "",
    date: "",
    tags: "",
    description: "",
    source: "",
    status: "Ongoing",
    version: "",
    year: "",
    type: "PDF",
    category: "Audit",
    link: ""
  };

  const [form, setForm] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPubId, setEditingPubId] = useState(null);
  const [pubToDelete, setPubToDelete] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Upload a file directly to Cloudinary from the browser
  const uploadToCloudinary = async (file, resourceType = "image") => {
    const sigRes = await fetch(`/api/admin/sign-upload?resource_type=${resourceType}`);
    const sigData = await sigRes.json();
    if (!sigData.success) throw new Error("Failed to get upload signature");

    const { signature, timestamp, cloudName, apiKey, folder } = sigData;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );
    const uploadData = await uploadRes.json();
    if (uploadData.error) throw new Error(uploadData.error.message);
    return uploadData.secure_url;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFile(file);
    setPdfFileName(file.name);
  };

  const handleSave = async () => {
  setIsSubmitting(true);
  setUploadError(null);
  try {
    let imgUrl = "";
    let fileUrl = "";

    // Upload image directly to Cloudinary if a new one was chosen
    if (imageFile) {
      setUploadProgress("Uploading cover image...");
      try {
        imgUrl = await uploadToCloudinary(imageFile, "image");
      } catch (e) {
        setUploadError(e.message);
        setUploadProgress("");
        setIsSubmitting(false);
        return;
      }
    }

    // Upload PDF directly to Cloudinary if a new one was chosen
    if (pdfFile) {
      setUploadProgress("Uploading PDF document...");
      try {
        fileUrl = await uploadToCloudinary(pdfFile, "raw");
      } catch (e) {
        setUploadError(e.message);
        setUploadProgress("");
        setIsSubmitting(false);
        return;
      }
    }

    setUploadProgress("Saving to database...");

    const url = editingPubId ? `/api/admin/publications/${editingPubId}` : "/api/admin/publications";
    const method = editingPubId ? "PUT" : "POST";

    const payload = {
      ...form,
      ...(imgUrl && { imgUrl }),
      ...(fileUrl && { fileUrl }),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm(defaultForm);
      setImagePreview(null);
      setImageFile(null);
      setPdfFile(null);
      setPdfFileName("");
      setEditingPubId(null);
      setUploadProgress("");
      setUploadError(null);
      if (onRefetch) onRefetch();
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Something went wrong.");
      setUploadProgress("");
    }
  } catch (e) {
    console.error(e);
    alert("Failed to save publication: " + e.message);
    setUploadProgress("");
  } finally {
    setIsSubmitting(false);
  }
  };

  const handleEditClick = (pub) => {
    setEditingPubId(pub._id);
    
    setForm({
      title: pub.title || "",
      publicationType: pub.publicationType || "researchReport",
      author: pub.author || "",
      date: pub.date || "",
      tags: Array.isArray(pub.tags) ? pub.tags.join(", ") : (pub.tags || ""),
      description: pub.description || "",
      source: pub.source || "",
      status: pub.status || "Ongoing",
      version: pub.version || "",
      year: pub.year || "",
      type: pub.type || "PDF",
      category: pub.category || "Audit",
      link: pub.link || ""
    });

    setImagePreview(pub.img || null);
    setImageFile(null);
    setPdfFile(null);
    setPdfFileName(pub.file && pub.file.startsWith("http") ? "Existing PDF on Cloudinary" : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPubId(null);
    setForm(defaultForm);
    setImagePreview(null);
    setImageFile(null);
    setPdfFile(null);
    setPdfFileName("");
    setUploadProgress("");
  };

  // Stats calculation
  const totalCount = publications.length;
  const researchCount = publications.filter(p => p.publicationType === "researchReport").length;
  const annualCount = publications.filter(p => p.publicationType === "annualReport").length;
  const projectCount = publications.filter(p => p.publicationType === "projectReport").length;

  return (
    <div className="space-y-10">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#8B5CF6] sm:shadow-[6px_6px_0px_#8B5CF6] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-mono-plum font-futura">{totalCount}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Total Publications</span>
        </div>
        <div className="bg-white border-2 border-vibrant-teal rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#14B8A6] sm:shadow-[6px_6px_0px_#14B8A6] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-vibrant-teal font-futura">{researchCount}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Research Reports</span>
        </div>
        <div className="bg-white border-2 border-vibrant-violet rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#7C3AED] sm:shadow-[6px_6px_0px_#7C3AED] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-vibrant-violet font-futura">{annualCount}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Annual Reviews</span>
        </div>
        <div className="bg-white border-2 border-vibrant-orange rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#F97316] sm:shadow-[6px_6px_0px_#F97316] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-vibrant-orange font-futura">{projectCount}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Project Reports</span>
        </div>
      </div>

      {/* Create / Edit Form */}
      <div className="bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-[8px_8px_0px_#8B5CF6] sm:shadow-[12px_12px_0px_#8B5CF6]">
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="p-2 sm:p-3 bg-vibrant-violet/10 rounded-xl">
            {editingPubId ? <Pencil className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" /> : <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" />}
          </div>
          <h2 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">
            {editingPubId ? "Edit Publication" : "Create New Publication"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {/* Publication Type (Selectable) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Publication Type</label>
            <select
              value={form.publicationType}
              onChange={e => setForm({ ...form, publicationType: e.target.value })}
              className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none text-sm sm:text-base text-black font-semibold"
            >
              <option value="researchReport">Research Report</option>
              <option value="annualReport">Annual Review (Audit / Annual Report)</option>
              <option value="projectReport">Project Report</option>
            </select>
          </div>

          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Publication Title</label>
            <input
              type="text"
              placeholder="Enter title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-medium"
            />
          </div>

          {/* Research Report Fields */}
          {form.publicationType === "researchReport" && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Author</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Arvan Singh"
                  value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Publish Date / Month</label>
                <input
                  type="text"
                  placeholder="e.g. Feb 2026"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Strategy, Trade, Security"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
            </>
          )}

          {/* Annual Review Fields */}
          {form.publicationType === "annualReport" && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Reporting Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2025"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Version</label>
                <input
                  type="text"
                  placeholder="e.g. FY 2024-2025"
                  value={form.version}
                  onChange={e => setForm({ ...form, version: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Audit Date / Period</label>
                <input
                  type="text"
                  placeholder="e.g. Financial Year 2024-2025"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Audit"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Report Type</label>
                <input
                  type="text"
                  placeholder="e.g. PDF"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
            </>
          )}

          {/* Project Report Fields */}
          {form.publicationType === "projectReport" && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Project Source / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Women Empowerment, Livelihood Development..."
                  value={form.source}
                  onChange={e => setForm({ ...form, source: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none text-sm sm:text-base text-black"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Timeline / Date</label>
                <input
                  type="text"
                  placeholder="e.g. Ongoing or March 2026"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">External Redirect Link (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. #"
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-[0.1em] text-vibrant-charcoal/50 mb-2">Description</label>
                <textarea
                  placeholder="Write a brief overview of the project report..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full min-h-[120px] p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black"
                />
              </div>
            </>
          )}
        </div>

        {/* Upload Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* Cover Image Preview */}
          {imagePreview && (
            <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 border-mono-plum group">
              <img src={imagePreview} alt="Cover Preview" className="w-full h-40 sm:h-56 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold uppercase tracking-widest">Cover Image Attached</span>
              </div>
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="absolute top-2 right-2 p-2 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-xl border-2 border-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PDF Attachment Preview */}
          {pdfFileName && (
            <div className="relative rounded-[1.5rem] sm:rounded-[2rem] p-6 bg-vibrant-offwhite border-2 border-dashed border-mono-plum flex flex-col justify-center items-center text-center group">
              <FileText className="w-12 h-12 text-mono-plum mb-2" />
              <span className="text-sm font-bold text-mono-plum truncate max-w-full px-4">{pdfFileName}</span>
              <span className="text-xs text-vibrant-charcoal/60 mt-1 uppercase tracking-wider">PDF document attached</span>
              <button
                type="button"
                onClick={() => { setPdfFile(null); setPdfFileName(""); }}
                className="absolute top-2 right-2 p-2 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-xl border-2 border-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons / Attachments */}
        <div className="flex flex-col gap-3 sm:gap-6 mt-6 sm:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Attach Cover Image */}
            <label className="flex items-center justify-center gap-2 px-5 py-3 sm:py-4 bg-vibrant-offwhite text-mono-plum rounded-xl sm:rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-vibrant-gray">
              <ImageIcon className="w-4 sm:w-5 h-4 sm:h-5" /> Cover Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {/* Attach PDF Document */}
            <label className="flex items-center justify-center gap-2 px-5 py-3 sm:py-4 bg-vibrant-offwhite text-mono-plum rounded-xl sm:rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-vibrant-gray">
              <FileText className="w-4 sm:w-5 h-4 sm:h-5" /> Attach PDF Document
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            </label>
          </div>

          {uploadProgress && (
              <div className="flex items-center gap-3 px-4 py-3 bg-vibrant-violet/10 border border-vibrant-violet/20 rounded-xl">
                <div className="w-4 h-4 rounded-full border-2 border-vibrant-violet border-t-transparent animate-spin flex-shrink-0" />
                <span className="text-xs font-bold text-vibrant-violet uppercase tracking-wider">{uploadProgress}</span>
              </div>
            )}
            {uploadError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                <span className="font-bold">Upload Error:</span> {uploadError}
              </div>
            )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-slate-100 pt-6">
            {editingPubId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center justify-center px-5 sm:px-8 py-3 sm:py-5 bg-white border-2 border-mono-plum text-mono-plum rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-base hover:bg-vibrant-gray transition-all shadow-md"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 sm:gap-3 flex-1 sm:flex-none px-5 sm:px-12 py-3 sm:py-5 bg-mono-plum text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-base hover:bg-vibrant-violet transition-all shadow-xl shadow-mono-plum/20 active:translate-y-1 disabled:opacity-50"
            >
              {isSubmitting
                ? (uploadProgress || (editingPubId ? "Updating..." : "Creating..."))
                : (editingPubId ? "Update Publication" : "Create Publication")}
              {isSubmitting
                ? <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <Send className="w-4 sm:w-5 h-4 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Publications List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
        <h3 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">Manage Publications</h3>
        <select
          value={selectedTypeFilter}
          onChange={e => setSelectedTypeFilter(e.target.value)}
          className="w-full sm:w-auto p-2.5 sm:p-4 bg-white border-2 border-vibrant-gray rounded-lg sm:rounded-2xl focus:border-mono-plum outline-none font-bold text-xs sm:text-sm uppercase tracking-widest text-vibrant-charcoal"
        >
          <option value="">All Types</option>
          <option value="researchReport">Research Reports</option>
          <option value="annualReport">Annual Reviews</option>
          <option value="projectReport">Project Reports</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search publications by title, author, or category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-4 bg-white rounded-lg sm:rounded-2xl border-2 border-vibrant-gray focus:border-mono-plum outline-none text-xs sm:text-sm text-black font-semibold transition-all shadow-sm"
        />
        <Search className="w-4 sm:w-5 h-4 sm:h-5 text-vibrant-charcoal/40 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            type="button"
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
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Details</th>
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Type &amp; Info</th>
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-vibrant-gray">
              {publications
                .filter(pub => {
                  const matchesType = selectedTypeFilter ? pub.publicationType === selectedTypeFilter : true;
                  const query = searchQuery.toLowerCase();
                  const matchesSearch = !searchQuery ||
                    pub.title?.toLowerCase().includes(query) ||
                    pub.author?.toLowerCase().includes(query) ||
                    pub.category?.toLowerCase().includes(query) ||
                    pub.description?.toLowerCase().includes(query) ||
                    pub.source?.toLowerCase().includes(query);
                  return matchesType && matchesSearch;
                })
                .map((pub) => (
                  <tr key={pub._id} className="hover:bg-vibrant-offwhite/50 transition-colors">
                    <td className="px-4 sm:px-10 py-5 sm:py-8 flex gap-3 sm:gap-4 items-start sm:items-center">
                      {pub.img && <img src={pub.img} alt="Cover" className="w-12 sm:w-16 h-16 sm:h-20 rounded-lg object-contain bg-slate-50 flex-shrink-0 border" />}
                      <div className="min-w-0">
                        <p className="text-base sm:text-lg text-mono-plum mb-1 font-bold line-clamp-2">{pub.title}</p>
                        {pub.author && <p className="text-xs sm:text-sm text-vibrant-charcoal/60 mb-0.5 font-medium">Author: {pub.author}</p>}
                        {pub.date && <p className="text-[10px] text-vibrant-charcoal/40 uppercase tracking-widest">Date: {pub.date}</p>}
                      </div>
                    </td>
                    <td className="px-4 sm:px-10 py-5 sm:py-8">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${
                        pub.publicationType === "researchReport" ? "bg-vibrant-teal/10 text-vibrant-teal" :
                        pub.publicationType === "annualReport" ? "bg-vibrant-violet/10 text-vibrant-violet" :
                        "bg-vibrant-orange/10 text-vibrant-orange"
                      }`}>
                        {pub.publicationType === "researchReport" ? "Research Report" :
                         pub.publicationType === "annualReport" ? "Annual Review" :
                         "Project Report"}
                      </span>
                      {pub.publicationType === "annualReport" && (
                        <p className="text-xs text-vibrant-charcoal/60 font-bold">{pub.version || pub.year}</p>
                      )}
                      {pub.publicationType === "projectReport" && (
                        <p className="text-xs text-vibrant-charcoal/60 font-bold">Status: {pub.status}</p>
                      )}
                    </td>
                    <td className="px-4 sm:px-10 py-5 sm:py-8">
                      <div className="flex justify-end gap-2 sm:gap-4">
                        {pub.file && (
                          <a
                            href={pub.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white border-2 border-vibrant-gray rounded-lg sm:rounded-2xl hover:border-vibrant-teal hover:bg-vibrant-teal hover:text-white transition-all text-xs sm:text-sm uppercase px-2.5 sm:px-6"
                          >
                            <Eye className="w-4 sm:w-5 h-4 sm:h-5" /> <span className="hidden sm:inline">PDF</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditClick(pub)}
                          className="flex items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white border-2 border-vibrant-gray rounded-lg sm:rounded-2xl hover:border-vibrant-violet hover:bg-vibrant-violet hover:text-white transition-all text-xs sm:text-sm uppercase px-2.5 sm:px-6"
                        >
                          <Pencil className="w-4 sm:w-5 h-4 sm:h-5" /> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPubToDelete(pub)}
                          className="flex items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-white border-2 border-red-200 text-red-600 rounded-lg sm:rounded-2xl hover:bg-red-600 hover:text-white transition-all text-xs sm:text-sm uppercase px-2.5 sm:px-6"
                        >
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
        {publications
          .filter(pub => {
            const matchesType = selectedTypeFilter ? pub.publicationType === selectedTypeFilter : true;
            const query = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
              pub.title?.toLowerCase().includes(query) ||
              pub.author?.toLowerCase().includes(query) ||
              pub.category?.toLowerCase().includes(query);
            return matchesType && matchesSearch;
          })
          .map((pub) => (
            <div key={pub._id} className="bg-white border-2 border-vibrant-gray rounded-lg p-3 shadow-md hover:shadow-lg hover:border-mono-plum transition-all">
              <div className="flex gap-2 mb-3">
                {pub.img && <img src={pub.img} alt="Cover" className="w-14 h-16 rounded-lg object-contain bg-slate-50 border flex-shrink-0" />}
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-mono-plum line-clamp-2">{pub.title}</p>
                  {pub.author && <p className="text-xs text-vibrant-charcoal/60 mb-0.5">{pub.author}</p>}
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1 ${
                    pub.publicationType === "researchReport" ? "bg-vibrant-teal/10 text-vibrant-teal" :
                    pub.publicationType === "annualReport" ? "bg-vibrant-violet/10 text-vibrant-violet" :
                    "bg-vibrant-orange/10 text-vibrant-orange"
                  }`}>
                    {pub.publicationType === "researchReport" ? "Research" :
                     pub.publicationType === "annualReport" ? "Annual Review" :
                     "Project"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-100 pt-2">
                {pub.file && (
                  <a href={pub.file} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 p-2 bg-vibrant-teal text-white rounded-lg hover:bg-vibrant-teal/80 transition-all text-xs font-bold uppercase">
                    <Eye className="w-3.5 h-3.5" /> PDF
                  </a>
                )}
                <button type="button" onClick={() => handleEditClick(pub)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-vibrant-violet text-white rounded-lg hover:bg-vibrant-violet/80 transition-all text-xs font-bold uppercase">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button type="button" onClick={() => setPubToDelete(pub)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-bold uppercase">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      {pubToDelete && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-mono-plum text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-vibrant-violet/20 rounded-full blur-3xl opacity-60"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-white shadow-xl">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="font-futura text-3xl font-black uppercase tracking-wide text-mono-plum mb-4">
                Delete Publication?
              </h3>
              <p className="text-vibrant-charcoal/70 mb-6 font-medium leading-relaxed text-lg px-2">
                You are about to permanently delete the publication: <br />
                <span className="inline-block mt-4 px-4 py-3 bg-vibrant-offwhite border-2 border-vibrant-gray rounded-xl font-bold text-mono-plum shadow-inner">
                  {pubToDelete.title}
                </span>
              </p>
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-10 inline-block shadow-sm">
                Warning: This action cannot be undone
              </div>
              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  type="button"
                  onClick={() => setPubToDelete(null)}
                  className="flex-1 py-5 bg-white border-2 border-vibrant-gray text-vibrant-charcoal rounded-2xl font-black uppercase tracking-widest text-sm hover:border-mono-plum hover:bg-vibrant-offwhite transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(pubToDelete._id);
                    setPubToDelete(null);
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