"use client";
import { useState } from "react";
import { Plus, X, Send, Image as ImageIcon, ArrowUpRight, Edit, Trash2 } from "lucide-react";

// ── Member Inbox (pending opinions queue) ────────────────────────────────────
function PendingInbox({ pendingOpinions, onSelect }) {
  return (
    <section className="lg:col-span-5 flex flex-col">
      <div className="flex items-center justify-between mb-6 px-4">
        <h3 className="font-futura text-sm font-black uppercase tracking-[0.2em] text-vibrant-charcoal/60">Member Inbox</h3>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-vibrant-gray shadow-sm">
          <div className="w-2 h-2 rounded-full bg-vibrant-teal animate-pulse" />
          <span className="text-xs font-black text-vibrant-teal uppercase tracking-widest">{pendingOpinions.length} New</span>
        </div>
      </div>
      <div className="space-y-6 max-h-[650px] overflow-y-auto pr-4 custom-scrollbar">
        {pendingOpinions.map((op) => (
          <button
            key={op.id}
            onClick={() => onSelect(op)}
            className="w-full bg-white border-2 border-vibrant-gray p-8 rounded-[2rem] flex flex-col gap-4 hover:border-mono-plum hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-vibrant-offwhite border-2 border-vibrant-gray rounded-2xl flex items-center justify-center font-black text-mono-plum text-lg">{op.avatar}</div>
                <div className="text-left">
                  <p className="text-base font-black text-mono-plum uppercase">{op.user}</p>
                  <p className="text-xs text-vibrant-violet tracking-widest uppercase">{op.date}</p>
                </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-vibrant-charcoal/20 group-hover:text-vibrant-violet transition-all" />
            </div>
            <p className="text-left text-base font-medium text-vibrant-charcoal/80 leading-relaxed line-clamp-3">&quot;{op.text}&quot;</p>
            <div className="h-2 w-0 bg-vibrant-violet absolute bottom-0 left-0 group-hover:w-full transition-all duration-500" />
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Previous Blogs table ─────────────────────────────────────────────────────
const PREVIOUS_BLOGS = [
  { id: 1, title: "The Future of Public Policy", date: "April 18, 2026", views: "1,205", reach: "+12%" },
  { id: 2, title: "Next Gen Healthcare Hubs", date: "April 12, 2026", views: "3,440", reach: "+24%" },
];

function PreviousBlogsTable() {
  return (
    <section className="pt-12">
      <div className="flex items-center gap-6 mb-8">
        <h2 className="font-futura text-2xl font-black uppercase text-mono-plum whitespace-nowrap">Previous Blogs</h2>
        <div className="flex-1 h-1 bg-vibrant-gray" />
      </div>
      <div className="bg-white border-2 border-mono-plum rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-vibrant-offwhite border-b-2 border-vibrant-gray">
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Article Title &amp; Date</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50">Performance</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-vibrant-charcoal/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-vibrant-gray">
              {PREVIOUS_BLOGS.map((blog) => (
                <tr key={blog.id} className="hover:bg-vibrant-offwhite/50 transition-colors">
                  <td className="px-10 py-8">
                    <p className="text-xl text-mono-plum mb-1">{blog.title}</p>
                    <p className="text-sm text-vibrant-charcoal/40 uppercase tracking-widest">PUBLISHED: {blog.date}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-lg font-black text-mono-plum">{blog.views}</p>
                    <p className="text-[10px] font-black text-vibrant-teal uppercase tracking-widest">{blog.reach} REACH</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-end gap-4">
                      <button className="flex items-center gap-2 p-4 bg-white border-2 border-vibrant-gray rounded-2xl hover:border-mono-plum hover:bg-mono-plum hover:text-white transition-all text-sm uppercase px-6">
                        <Edit className="w-5 h-5" /> Edit
                      </button>
                      <button className="flex items-center gap-2 p-4 bg-white border-2 border-red-200 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-sm uppercase px-6">
                        <Trash2 className="w-5 h-5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── Main MembersTab export ───────────────────────────────────────────────────
export default function MembersTab({ pendingOpinions, onSelectOpinion }) {
  const [opinionText, setOpinionText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Write opinion */}
        <section className="lg:col-span-7">
          <div className="bg-white border-2 border-mono-plum rounded-[2.5rem] p-10 shadow-[12px_12px_0px_#8B5CF6]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-vibrant-violet/10 rounded-xl"><Plus className="w-6 h-6 text-vibrant-violet" /></div>
              <h2 className="font-futura text-2xl font-black uppercase text-mono-plum">Write New Opinion</h2>
            </div>
            <textarea
              value={opinionText}
              onChange={(e) => setOpinionText(e.target.value)}
              placeholder="Type your official response or stance here..."
              className="w-full min-h-[250px] p-8 bg-vibrant-offwhite rounded-3xl border-2 border-transparent focus:border-vibrant-violet outline-none transition-all text-mono-plum font-semibold text-lg placeholder:text-vibrant-charcoal/30"
            />
            {imagePreview && (
              <div className="mt-6 relative rounded-[2rem] overflow-hidden border-2 border-mono-plum group">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                <button onClick={() => setImagePreview(null)} className="absolute top-4 right-4 p-3 bg-mono-plum text-white rounded-full hover:bg-red-500 shadow-xl border-2 border-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-6">
              <label className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-vibrant-offwhite text-mono-plum rounded-2xl cursor-pointer hover:bg-vibrant-gray transition-all font-black text-sm uppercase tracking-widest border-2 border-vibrant-gray">
                <ImageIcon className="w-5 h-5" /> Attach Photo
                <input type="file" className="hidden" onChange={(e) => setImagePreview(URL.createObjectURL(e.target.files[0]))} />
              </label>
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-mono-plum text-white rounded-2xl font-black uppercase tracking-widest text-base hover:bg-vibrant-violet transition-all shadow-xl shadow-mono-plum/20 active:translate-y-1">
                Post Opinion <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <PendingInbox pendingOpinions={pendingOpinions} onSelect={onSelectOpinion} />
      </div>

      <PreviousBlogsTable />
    </>
  );
}
