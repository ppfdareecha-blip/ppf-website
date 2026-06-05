import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Send, Image as ImageIcon, Eye, Trash2, Pencil, Search, Briefcase, GraduationCap, BookOpen, Info } from "lucide-react";

export default function CareersTab({ careers, onDelete, onRefetch }) {
  const [form, setForm] = useState({
    type: "job", // 'job' | 'intern' | 'course'
    title: "",
    category: "",
    description: "",
    location: "",
    duration: "",
    stipend: "",
    price: "",
    startDate: "",
    requirements: "",
    responsibilities: "",
    applyLink: "",
    status: "active"
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState(null);
  const [careerToDelete, setCareerToDelete] = useState(null);
  const [careerToView, setCareerToView] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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
    if (!form.title) {
      alert("Title is required!");
      return;
    }
    setIsSubmitting(true);
    try {
      const url = editingCareerId ? `/api/admin/careers/${editingCareerId}` : "/api/admin/careers";
      const method = editingCareerId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageBase64 }),
      });
      if (res.ok) {
        setForm({
          type: "job",
          title: "",
          category: "",
          description: "",
          location: "",
          duration: "",
          stipend: "",
          price: "",
          startDate: "",
          requirements: "",
          responsibilities: "",
          applyLink: "",
          status: "active"
        });
        setImagePreview(null);
        setImageBase64("");
        setEditingCareerId(null);
        if (onRefetch) onRefetch();
      } else {
        const errData = await res.json();
        alert("Failed to save: " + (errData.error || errData.message || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while saving.");
    }
    setIsSubmitting(false);
  };

  const handleEditClick = (career) => {
    setEditingCareerId(career._id);
    setForm({
      type: career.type || "job",
      title: career.title || "",
      category: career.category || "",
      description: career.description || "",
      location: career.location || "",
      duration: career.duration || "",
      stipend: career.stipend || "",
      price: career.price || "",
      startDate: career.startDate || "",
      requirements: career.requirements || "",
      responsibilities: career.responsibilities || "",
      applyLink: career.applyLink || "",
      status: career.status || "active"
    });
    setImagePreview(career.image || null);
    setImageBase64("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCareerId(null);
    setForm({
      type: "job",
      title: "",
      category: "",
      description: "",
      location: "",
      duration: "",
      stipend: "",
      price: "",
      startDate: "",
      requirements: "",
      responsibilities: "",
      applyLink: "",
      status: "active"
    });
    setImagePreview(null);
    setImageBase64("");
  };

  // Stats calculation
  const totalCareers = careers.length;
  const activeJobs = careers.filter(c => c.type === "job" && c.status === "active").length;
  const activeInterns = careers.filter(c => c.type === "intern" && c.status === "active").length;
  const activeCourses = careers.filter(c => c.type === "course" && c.status === "active").length;

  const filteredCareers = careers.filter(career => {
    const matchesType = filterType ? career.type === filterType : true;
    const matchesStatus = filterStatus ? career.status === filterStatus : true;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      career.title?.toLowerCase().includes(query) || 
      career.category?.toLowerCase().includes(query) || 
      career.description?.toLowerCase().includes(query) || 
      career.location?.toLowerCase().includes(query);

    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#8B5CF6] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-mono-plum font-futura">{totalCareers}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Total Openings</span>
        </div>
        <div className="bg-white border-2 border-vibrant-teal rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#14B8A6] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-vibrant-teal font-futura">{activeJobs}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Active Jobs</span>
        </div>
        <div className="bg-white border-2 border-vibrant-violet rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#7C3AED] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-vibrant-violet font-futura">{activeInterns}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Active Internships</span>
        </div>
        <div className="bg-white border-2 border-amber-500 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 shadow-[4px_4px_0px_#F59E0B] flex flex-col items-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-amber-500 font-futura">{activeCourses}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mt-2">Active Courses</span>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-[8px_8px_0px_#8B5CF6]">
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="p-2 sm:p-3 bg-vibrant-violet/10 rounded-xl">
            {editingCareerId ? <Pencil className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" /> : <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-vibrant-violet" />}
          </div>
          <h2 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">
            {editingCareerId ? "Edit Career Entry" : "Create Career/Course Posting"}
          </h2>
        </div>

        {/* Dynamic Fields Layout */}
        <div className="space-y-6">
          {/* Type Selector (Job, Intern, Course) */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-2 block">Posting Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "job", label: "Job Opening", icon: Briefcase, color: "hover:border-vibrant-teal active:bg-vibrant-teal", activeColor: "bg-vibrant-teal text-white border-vibrant-teal shadow-[3px_3px_0px_#0D9488]" },
                { id: "intern", label: "Intern Opening", icon: GraduationCap, color: "hover:border-vibrant-violet active:bg-vibrant-violet", activeColor: "bg-vibrant-violet text-white border-vibrant-violet shadow-[3px_3px_0px_#6D28D9]" },
                { id: "course", label: "Course Listing", icon: BookOpen, color: "hover:border-amber-500 active:bg-amber-500", activeColor: "bg-amber-500 text-white border-amber-500 shadow-[3px_3px_0px_#D97706]" }
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = form.type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setForm({ ...form, type: t.id })}
                    type="button"
                    className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 font-black uppercase tracking-wider text-xs sm:text-sm transition-all ${
                      isSelected ? t.activeColor : "bg-white border-vibrant-gray text-vibrant-charcoal/70 " + t.color
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Title *</label>
              <input
                type="text"
                placeholder="Title (e.g. Senior Researcher, Policy Intern, Governance Masterclass)"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
              />
            </div>

            {/* Category / Department / Track */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">
                {form.type === "course" ? "Track / Category" : "Department / Team"}
              </label>
              <input
                type="text"
                placeholder={form.type === "course" ? "e.g. Advanced Analytics, Foundations" : "e.g. National Security, Cyber Cell"}
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Location</label>
              <input
                type="text"
                placeholder={form.type === "course" ? "e.g. Online, In-Person (New Delhi)" : "e.g. Remote, Hybrid, New Delhi HQ"}
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
              />
            </div>

            {/* Conditionally Render: Duration (Intern & Course Only) */}
            {(form.type === "intern" || form.type === "course") && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Duration</label>
                <input
                  type="text"
                  placeholder={form.type === "course" ? "e.g. 6 Weeks, 3 Months" : "e.g. 3 Months, 6 Months"}
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
                />
              </div>
            )}

            {/* Conditionally Render: Start Date (Intern & Course Only) */}
            {(form.type === "intern" || form.type === "course") && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. Immediate, July 15, 2026"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
                />
              </div>
            )}

            {/* Conditionally Render: Stipend / Salary (Job & Intern Only) */}
            {(form.type === "job" || form.type === "intern") && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Stipend / Salary</label>
                <input
                  type="text"
                  placeholder="e.g. ₹15,000/mo, Competitive, Unpaid"
                  value={form.stipend}
                  onChange={e => setForm({ ...form, stipend: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
                />
              </div>
            )}

            {/* Conditionally Render: Price (Course Only) */}
            {form.type === "course" && (
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Price / Fees</label>
                <input
                  type="text"
                  placeholder="e.g. Free, ₹1,499, $50"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
                />
              </div>
            )}

            {/* Status Option */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none appearance-none text-sm sm:text-base text-black font-semibold shadow-inner"
              >
                <option value="active">Active / Open</option>
                <option value="closed">Closed / Inactive</option>
              </select>
            </div>

            {/* Apply / Enroll Link */}
            <div className="sm:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Apply / Enroll Link</label>
              <input
                type="text"
                placeholder="Google Form Link, Enrollment URL, or contact details"
                value={form.applyLink}
                onChange={e => setForm({ ...form, applyLink: e.target.value })}
                className="w-full p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
              />
            </div>

            {/* Large TextAreas */}
            <div className="sm:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">Description / Details</label>
              <textarea
                placeholder="Write a summary about the job, intern role, or course objectives..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full min-h-[100px] p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">
                {form.type === "course" ? "Eligibility / Prerequisites" : "Requirements / Qualifications"}
              </label>
              <textarea
                placeholder={form.type === "course" ? "e.g. Open to all students, Basic knowledge of polity..." : "e.g. Masters degree in Security, Experience with data analysis..."}
                value={form.requirements}
                onChange={e => setForm({ ...form, requirements: e.target.value })}
                className="w-full min-h-[100px] p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-1.5 block">
                {form.type === "course" ? "Course Syllabus / Outline" : "Key Responsibilities / Deliverables"}
              </label>
              <textarea
                placeholder={form.type === "course" ? "e.g. Week 1: Intro to Governance, Week 2: Legislative drafting..." : "e.g. Conduct daily research, Compile policy reports..."}
                value={form.responsibilities}
                onChange={e => setForm({ ...form, responsibilities: e.target.value })}
                className="w-full min-h-[100px] p-3 sm:p-4 bg-vibrant-offwhite rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-vibrant-violet outline-none text-sm sm:text-base text-black font-semibold shadow-inner"
              />
            </div>
          </div>

          {/* Banner Upload for Courses/Jobs */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-vibrant-charcoal/60 mb-2 block">
              {form.type === "course" ? "Course Banner (Optional)" : "Job / Intern Poster Banner (Optional)"}
            </label>
            {imagePreview && (
              <div className="mb-4 relative rounded-2xl overflow-hidden border-2 border-mono-plum group max-w-lg">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageBase64(""); }}
                  className="absolute top-3 right-3 p-2 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-xl border-2 border-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <label className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-4 bg-vibrant-offwhite text-mono-plum rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-vibrant-gray shadow-sm">
              <ImageIcon className="w-5 h-5 shrink-0" />
              <span>Attach Banner Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-vibrant-gray">
            {editingCareerId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center justify-center px-8 py-4 bg-white border-2 border-mono-plum text-mono-plum rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-vibrant-gray transition-all shadow-md active:translate-y-0.5"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-10 py-4 bg-mono-plum text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-vibrant-violet transition-all shadow-xl shadow-mono-plum/20 active:translate-y-1 disabled:opacity-50"
            >
              <span>{editingCareerId ? (isSubmitting ? "Updating..." : "Update Posting") : (isSubmitting ? "Creating..." : "Publish Posting")}</span>
              <Send className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Careers List section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-futura text-lg sm:text-2xl font-black uppercase text-mono-plum">Manage Openings</h3>
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="p-2.5 sm:p-4 bg-white border-2 border-vibrant-gray rounded-xl focus:border-mono-plum outline-none font-bold text-xs uppercase tracking-widest text-vibrant-charcoal"
            >
              <option value="">All Types</option>
              <option value="job">Jobs</option>
              <option value="intern">Internships</option>
              <option value="course">Courses</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="p-2.5 sm:p-4 bg-white border-2 border-vibrant-gray rounded-xl focus:border-mono-plum outline-none font-bold text-xs uppercase tracking-widest text-vibrant-charcoal"
            >
              <option value="">All Status</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search title, department, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl border-2 border-vibrant-gray focus:border-mono-plum outline-none text-sm text-black font-semibold transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-vibrant-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-vibrant-charcoal/40 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-vibrant-gray/50"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden md:block bg-white border-2 border-mono-plum rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-vibrant-offwhite border-b-2 border-vibrant-gray">
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Details</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Type &amp; Category</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Status</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-vibrant-gray">
                {filteredCareers.map((c) => {
                  let typeColor = "bg-vibrant-teal text-white";
                  if (c.type === "intern") typeColor = "bg-vibrant-violet text-white";
                  if (c.type === "course") typeColor = "bg-amber-500 text-white";

                  return (
                    <tr key={c._id} className="hover:bg-vibrant-offwhite/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex gap-4 items-center">
                          {c.image && <img src={c.image} alt="Banner" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-lg text-mono-plum font-bold line-clamp-1">{c.title}</p>
                            <p className="text-xs text-vibrant-charcoal/60 line-clamp-1">{c.location || "Location not specified"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${typeColor}`}>
                          {c.type}
                        </span>
                        <p className="text-xs font-bold text-vibrant-charcoal/60 mt-1 line-clamp-1">{c.category || "General"}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-block text-xs font-black uppercase tracking-wider ${
                          c.status === "active" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {c.status === "active" ? "Open" : "Closed"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setCareerToView(c)} className="flex items-center gap-1.5 p-3 bg-white border-2 border-vibrant-gray rounded-xl hover:border-vibrant-teal hover:bg-vibrant-teal hover:text-white transition-all text-xs uppercase px-4">
                            <Eye className="w-4 h-4" /> <span>View</span>
                          </button>
                          <button onClick={() => handleEditClick(c)} className="flex items-center gap-1.5 p-3 bg-white border-2 border-vibrant-gray rounded-xl hover:border-vibrant-violet hover:bg-vibrant-violet hover:text-white transition-all text-xs uppercase px-4">
                            <Pencil className="w-4 h-4" /> <span>Edit</span>
                          </button>
                          <button onClick={() => setCareerToDelete(c)} className="flex items-center gap-1.5 p-3 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase px-4">
                            <Trash2 className="w-4 h-4" /> <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCareers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-vibrant-charcoal/50 font-bold">
                      No matching careers or courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View Card Grid */}
        <div className="md:hidden space-y-4">
          {filteredCareers.map((c) => {
            let typeColor = "bg-vibrant-teal text-white";
            if (c.type === "intern") typeColor = "bg-vibrant-violet text-white";
            if (c.type === "course") typeColor = "bg-amber-500 text-white";

            return (
              <div key={c._id} className="bg-white border-2 border-vibrant-gray rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex gap-3">
                  {c.image && <img src={c.image} alt="Banner" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${typeColor}`}>
                        {c.type}
                      </span>
                      <span className={`text-[10px] font-black uppercase ${c.status === "active" ? "text-emerald-600" : "text-rose-600"}`}>
                        {c.status === "active" ? "Open" : "Closed"}
                      </span>
                    </div>
                    <p className="text-base font-bold text-mono-plum line-clamp-1">{c.title}</p>
                    <p className="text-xs text-vibrant-charcoal/60 line-clamp-1">{c.location || "Location not specified"}</p>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-vibrant-gray/50 pt-3">
                  <button onClick={() => setCareerToView(c)} className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-vibrant-teal text-white rounded-lg hover:bg-vibrant-teal/80 transition-all text-xs font-black uppercase">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button onClick={() => handleEditClick(c)} className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-vibrant-violet text-white rounded-lg hover:bg-vibrant-violet/80 transition-all text-xs font-black uppercase">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setCareerToDelete(c)} className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-black uppercase">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
          {filteredCareers.length === 0 && (
            <div className="text-center py-10 text-vibrant-charcoal/50 font-bold bg-white border border-vibrant-gray rounded-2xl">
              No matching careers or courses found.
            </div>
          )}
        </div>
      </div>

      {/* Modals via React Portal */}
      {mounted && typeof document !== "undefined" && (
        <>
          {/* Detail View Modal */}
          {careerToView && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-mono-plum/70 backdrop-blur-md animate-in fade-in">
              <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden border-4 border-mono-plum shadow-2xl max-h-[90vh] flex flex-col">
                <div className="p-8 border-b-2 border-vibrant-gray flex justify-between items-center bg-vibrant-offwhite sticky top-0 z-10">
                  <h2 className="font-futura text-2xl font-black uppercase text-mono-plum">Posting Details</h2>
                  <button onClick={() => setCareerToView(null)} className="p-2.5 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum shadow-sm">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-8 space-y-6 overflow-y-auto">
                  {careerToView.image && (
                    <img src={careerToView.image} alt="Banner" className="w-full h-56 object-cover rounded-2xl border-2 border-mono-plum shadow-md" />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FA] p-6 rounded-2xl border-2 border-vibrant-gray shadow-inner">
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Title</p>
                      <p className="text-xl font-bold text-mono-plum">{careerToView.title}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Type</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        careerToView.type === "job" ? "bg-vibrant-teal text-white" :
                        careerToView.type === "intern" ? "bg-vibrant-violet text-white" : "bg-amber-500 text-white"
                      }`}>
                        {careerToView.type}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">
                        {careerToView.type === "course" ? "Track / Topic" : "Department"}
                      </p>
                      <p className="text-base font-bold text-mono-plum">{careerToView.category || "General / Unspecified"}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Location</p>
                      <p className="text-base font-bold text-mono-plum">{careerToView.location || "Unspecified"}</p>
                    </div>

                    {careerToView.duration && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Duration</p>
                        <p className="text-base font-bold text-mono-plum">{careerToView.duration}</p>
                      </div>
                    )}

                    {careerToView.startDate && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Start Date</p>
                        <p className="text-base font-bold text-mono-plum">{careerToView.startDate}</p>
                      </div>
                    )}

                    {careerToView.type === "course" && careerToView.price && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Fees</p>
                        <p className="text-base font-bold text-mono-plum">{careerToView.price}</p>
                      </div>
                    )}

                    {careerToView.type !== "course" && careerToView.stipend && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Stipend / Salary</p>
                        <p className="text-base font-bold text-mono-plum">{careerToView.stipend}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-1">Status</p>
                      <span className={`font-black text-sm uppercase ${careerToView.status === "active" ? "text-emerald-600" : "text-rose-600"}`}>
                        {careerToView.status === "active" ? "Open" : "Closed / Inactive"}
                      </span>
                    </div>
                  </div>

                  {careerToView.description && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-2">Description</p>
                      <div className="bg-white p-6 rounded-2xl border-2 border-vibrant-gray whitespace-pre-wrap text-sm text-vibrant-charcoal/80 leading-relaxed shadow-inner">
                        {careerToView.description}
                      </div>
                    </div>
                  )}

                  {careerToView.requirements && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-2">
                        {careerToView.type === "course" ? "Eligibility" : "Requirements"}
                      </p>
                      <div className="bg-white p-6 rounded-2xl border-2 border-vibrant-gray whitespace-pre-wrap text-sm text-vibrant-charcoal/80 leading-relaxed shadow-inner">
                        {careerToView.requirements}
                      </div>
                    </div>
                  )}

                  {careerToView.responsibilities && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 mb-2">
                        {careerToView.type === "course" ? "Syllabus Outline" : "Responsibilities"}
                      </p>
                      <div className="bg-white p-6 rounded-2xl border-2 border-vibrant-gray whitespace-pre-wrap text-sm text-vibrant-charcoal/80 leading-relaxed shadow-inner">
                        {careerToView.responsibilities}
                      </div>
                    </div>
                  )}

                  {careerToView.applyLink && (
                    <div className="pt-4 border-t border-vibrant-gray flex items-center justify-between">
                      <p className="text-xs text-vibrant-charcoal/50 font-bold uppercase tracking-wider">Application Link / URL:</p>
                      <a
                        href={careerToView.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-mono-plum text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-vibrant-violet transition-all shadow-md active:translate-y-0.5"
                      >
                        Visit Link
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Delete Confirmation Modal */}
          {careerToDelete && createPortal(
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
              <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-mono-plum text-center relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-vibrant-violet/20 rounded-full blur-3xl opacity-60"></div>

                <div className="relative z-10">
                  <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-white shadow-xl">
                    <Trash2 className="w-10 h-10" />
                  </div>
                  
                  <h3 className="font-futura text-3xl font-black uppercase tracking-wide text-mono-plum mb-4">
                    Delete Posting?
                  </h3>
                  
                  <p className="text-vibrant-charcoal/70 mb-6 font-medium leading-relaxed text-lg px-2">
                    Are you sure you want to permanently delete this career or course listing?<br/>
                    <span className="inline-block mt-4 px-4 py-3 bg-vibrant-offwhite border-2 border-vibrant-gray rounded-xl font-bold text-mono-plum shadow-inner">
                      {careerToDelete.title} ({careerToDelete.type})
                    </span>
                  </p>
                  
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-10 inline-block shadow-sm">
                    Warning: This action cannot be undone
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-5">
                    <button 
                      onClick={() => setCareerToDelete(null)} 
                      className="flex-1 py-5 bg-white border-2 border-vibrant-gray text-vibrant-charcoal rounded-2xl font-black uppercase tracking-widest text-sm hover:border-mono-plum hover:bg-vibrant-offwhite transition-all shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={async () => {
                        await onDelete(careerToDelete._id);
                        setCareerToDelete(null);
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
        </>
      )}
    </div>
  );
}
