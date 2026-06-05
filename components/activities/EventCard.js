"use client";

export default function EventCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-ppf-orange text-white text-[10px] font-lora font-bold px-2 py-1 uppercase tracking-widest shadow-md">
          {item.type}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between bg-[#F8FAFC]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-ppf-orange text-xs font-lato font-bold mb-3 tracking-wide uppercase">
            <span>{item.date}</span>
            {item.centerTag && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-ppf-purple bg-purple-50 px-2 py-0.5 rounded-full font-extrabold text-[10px]">{item.centerTag}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-lora font-bold text-[#001D4A] leading-snug mb-3 group-hover:text-ppf-purple transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 font-lato text-sm leading-relaxed mb-4 line-clamp-2">
            {item.summary}
          </p>
        </div>
        <div className="mt-2 pt-4 border-t border-gray-200 flex flex-col justify-between h-auto">
          <span className="flex items-center text-xs text-ppf-purple font-lato font-medium truncate mb-4">
            {item.location}
          </span>
          <span className="text-sm font-lato font-semibold text-[#001D4A] uppercase tracking-[0.15em] group-hover:text-ppf-teal transition-colors">
            View Event Details
          </span>
        </div>
      </div>
    </button>
  );
}
