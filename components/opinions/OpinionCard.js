import Link from "next/link";
import Image from "next/image";

export default function OpinionCard({ item }) {
  return (
    <Link
      href={`/pages/opinions/${item.id}`}
      className="opinion-card group flex flex-col p-2 border-2 border-ppf-purple rounded-lg"
    >
      <div className="relative h-[250px] w-full rounded-lg overflow-hidden mb-6 border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-ppf-purple/5 group-hover:-translate-y-1">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-lora font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            {item.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-grow px-2">
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-lato font-black text-ppf-teal uppercase tracking-widest mb-4">
          <span className="font-bold">{item.date}</span>
          {item.centerTag && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-ppf-purple font-bold px-2 py-0.5 bg-purple-50 rounded-full">{item.centerTag}</span>
            </>
          )}
        </div>
        <h4 className="text-xl font-lora font-black text-slate-900 leading-tight mb-4 group-hover:text-ppf-purple transition-colors duration-300 line-clamp-2">
          {item.title}
        </h4>
        
        {/* Updated to interpret and safely render the HTML payload as real elements */}
        <p 
          className="text-slate-500 font-lato text-sm leading-relaxed mb-6 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: item.excerpt }}
        />

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs font-lora font-black text-slate-800">{item.author}</span>
          <div className="w-8 h-8 rounded-full bg-ppf-orange/20 flex items-center justify-center text-ppf-orange group-hover:bg-ppf-purple group-hover:text-white transition-all duration-300">
            <span className="text-[10px] font-lora font-black">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}