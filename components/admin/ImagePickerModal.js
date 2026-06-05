"use client";
import { useState, useEffect, useRef } from "react";
import { X, ImageIcon, Upload, Check, Loader2, Search } from "lucide-react";

/**
 * ImagePickerModal
 *
 * Props:
 *   isOpen        – boolean
 *   onClose       – () => void
 *   onSelect      – ({ url, base64 }) => void
 *                   base64 is non-null only when the user uploads a NEW image.
 *                   url is always set.
 */
export default function ImagePickerModal({ isOpen, onClose, onSelect }) {
  const [library, setLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(null);   // url string from library
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  // Fetch library on open
  useEffect(() => {
    if (!isOpen) return;
    setSelected(null);
    setSearch("");
    setIsLoading(true);
    fetch("/api/admin/opinions-manage/images")
      .then(r => r.json())
      .then(({ data }) => setLibrary(data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = library.filter(img =>
    img.title?.toLowerCase().includes(search.toLowerCase()) || !search
  );

  // User picks a file to upload as a new image
  const handleNewFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      const url = URL.createObjectURL(file);
      onSelect({ url, base64 });
      onClose();
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // User picks from library
  const handleConfirm = () => {
    if (!selected) return;
    onSelect({ url: selected, base64: null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-mono-plum/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden border-4 border-mono-plum shadow-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-vibrant-offwhite border-b-2 border-vibrant-gray">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-vibrant-violet/10 rounded-xl">
              <ImageIcon className="w-5 h-5 text-vibrant-violet" />
            </div>
            <h2 className="font-futura text-xl font-black uppercase text-mono-plum">Image Library</h2>
            {library.length > 0 && (
              <span className="text-xs font-black text-vibrant-charcoal/40 uppercase tracking-widest ml-1">
                {library.length} image{library.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-vibrant-charcoal/40 hover:text-mono-plum">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload new + search */}
        <div className="flex items-center gap-4 px-8 py-4 border-b-2 border-vibrant-gray bg-white">
          <label className="flex items-center gap-2 px-5 py-3 bg-mono-plum text-white rounded-2xl cursor-pointer hover:bg-vibrant-violet transition-all font-black text-xs uppercase tracking-widest shrink-0">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload New
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleNewFile} />
          </label>
          <div className="flex-1 flex items-center gap-2 bg-vibrant-offwhite border-2 border-vibrant-gray rounded-2xl px-4 py-2 focus-within:border-vibrant-violet transition-all">
            <Search className="w-4 h-4 text-vibrant-charcoal/40 shrink-0" />
            <input
              type="text"
              placeholder="Search by opinion title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-vibrant-charcoal"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 gap-3 text-vibrant-charcoal/40">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-black uppercase tracking-widest">Loading library...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-vibrant-charcoal/30">
              <ImageIcon className="w-10 h-10" />
              <p className="text-sm font-black uppercase tracking-widest">
                {search ? "No images match your search" : "No previous images found"}
              </p>
              <p className="text-xs uppercase tracking-wider">Upload a new image above</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((img, i) => {
                const isSelected = selected === img.url;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(isSelected ? null : img.url)}
                    className={`relative group rounded-2xl overflow-hidden border-4 transition-all aspect-square focus:outline-none ${
                      isSelected
                        ? "border-vibrant-violet shadow-lg shadow-vibrant-violet/30 scale-[0.97]"
                        : "border-transparent hover:border-vibrant-violet/40"
                    }`}
                  >
                    <img src={img.url} alt={img.title || "Image"} className="w-full h-full object-cover" />
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-mono-plum/40 flex items-end p-3 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest line-clamp-2 leading-tight">{img.title}</p>
                    </div>
                    {/* Selected tick */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-7 h-7 bg-vibrant-violet rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t-2 border-vibrant-gray bg-vibrant-offwhite flex justify-between items-center">
          <span className="text-xs text-vibrant-charcoal/40 font-black uppercase tracking-widest">
            {selected ? "1 image selected" : "Select an image or upload new"}
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-3 border-2 border-vibrant-gray text-vibrant-charcoal/60 rounded-xl hover:border-mono-plum hover:text-mono-plum transition-all font-black text-xs uppercase tracking-widest">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="flex items-center gap-2 px-8 py-3 bg-vibrant-violet text-white rounded-xl hover:bg-mono-plum transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-vibrant-violet/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> Use Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
