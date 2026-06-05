import React, { useState, useEffect, useRef } from "react";
import { Trash2, Edit3, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";

const ITEMS_PER_PAGE = 6;

export default function NewslettersTab() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [date, setDate] = useState("");

  const formRef = useRef(null);
  const listRef = useRef(null);

  const fetchNewsletters = async () => {
    try {
      const res = await fetch("/api/admin/newsletters");
      const data = await res.json();
      if (data.success) {
        setNewsletters(data.data);
      }
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (formRef.current && !loading) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [loading]);

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const url = editingId ? `/api/admin/newsletters/${editingId}` : "/api/admin/newsletters";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, pdfLink, date }),
      });

      const data = await res.json();
      if (data.success) {
        setTitle("");
        setDescription("");
        setPdfLink("");
        setDate("");
        setEditingId(null);
        fetchNewsletters();
        setCurrentPage(1);
      } else {
        setErrorMsg(data.error || "Failed to save");
      }
    } catch (err) {
      setErrorMsg("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description || "");
    setPdfLink(item.pdfLink);
    setDate(item.date || "");
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this newsletter?")) {
      try {
        const res = await fetch(`/api/admin/newsletters/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchNewsletters();
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPdfLink("");
    setDate("");
  };

  // Pagination
  const totalPages = Math.ceil(newsletters.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNewsletters = newsletters.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 font-lato">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-gradient-to-b from-ppf-teal to-ppf-teal/50 rounded-full"></div>
          <h1 className="text-3xl md:text-4xl font-black font-futura uppercase text-slate-900">Newsletter Management</h1>
        </div>
        <p className="text-slate-600 ml-6 text-sm md:text-base font-lato">Create and manage your organization&apos;s newsletters</p>
      </div>

      {/* Form Section */}
      <div
        ref={formRef}
        className="mb-12 bg-white rounded-2xl shadow-lg border-l-4 border-ppf-teal overflow-hidden"
      >
        <div className="bg-gradient-to-r from-ppf-teal/10 to-ppf-teal/5 px-6 md:px-10 py-6 md:py-8 border-b border-slate-200">
          <h2 className="text-xl md:text-2xl font-black font-futura uppercase text-slate-900 flex items-center gap-3">
            {editingId ? <Edit3 size={24} className="text-ppf-teal" /> : <Plus size={24} className="text-ppf-teal" />}
            {editingId ? "Edit Newsletter" : "Create Newsletter"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 font-semibold text-sm">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-ppf-teal focus:outline-none focus:bg-white transition font-lato font-semibold placeholder-slate-400"
              placeholder="Newsletter title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                PDF Link <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="url"
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-ppf-teal focus:outline-none focus:bg-white transition font-lato font-semibold placeholder-slate-400"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-ppf-teal focus:outline-none focus:bg-white transition font-lato font-semibold placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-ppf-teal focus:outline-none focus:bg-white transition font-lato font-semibold placeholder-slate-400 resize-none"
              rows="4"
              placeholder="Newsletter description..."
            />
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition duration-200 uppercase text-sm tracking-wide"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-gradient-to-r from-ppf-orange to-ppf-orange/90 hover:shadow-lg text-white font-bold rounded-lg transition duration-200 disabled:opacity-60 uppercase text-sm tracking-wide"
            >
              {isSubmitting ? "Saving..." : editingId ? "Update" : "Post Newsletter"}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-black font-futura uppercase text-slate-900 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-ppf-teal to-ppf-teal/50 rounded-full"></div>
            Newsletters ({newsletters.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-ppf-teal/20 border-t-ppf-teal rounded-full mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading...</p>
          </div>
        ) : newsletters.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No newsletters yet. Create one to get started!</p>
          </div>
        ) : (
          <>
            {/* Grid of newsletters */}
            <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedNewsletters.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-slate-200 hover:border-ppf-teal/30 transition duration-300 overflow-hidden group"
                >
                  <div className="bg-gradient-to-r from-ppf-teal/10 to-ppf-teal/5 p-4 border-b border-slate-200">
                    <h3 className="font-lora font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-ppf-teal transition">
                      {item.title}
                    </h3>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Date</p>
                      <p className="text-sm font-semibold text-slate-700">{item.date || "Not set"}</p>
                    </div>

                    {item.description && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                        <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                      </div>
                    )}

                    <a
                      href={item.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-bold text-ppf-teal hover:text-ppf-teal/80 transition break-all"
                      title={item.pdfLink}
                    >
                      View PDF →
                    </a>
                  </div>

                  <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition duration-200"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition duration-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 md:gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 md:p-3 bg-white hover:bg-ppf-teal/10 text-ppf-teal disabled:opacity-40 rounded-lg transition border-2 border-slate-200 hover:border-ppf-teal"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition ${
                        currentPage === page
                          ? "bg-ppf-teal text-white shadow-lg"
                          : "bg-white border-2 border-slate-200 text-slate-700 hover:border-ppf-teal"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 md:p-3 bg-white hover:bg-ppf-teal/10 text-ppf-teal disabled:opacity-40 rounded-lg transition border-2 border-slate-200 hover:border-ppf-teal"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
