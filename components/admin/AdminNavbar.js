"use client";
import Image from "next/image";
import { LogOut, Search } from "lucide-react";

export default function AdminNavbar({ onLogout }) {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b-2 border-vibrant-gray px-8 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-8 w-8 sm:h-11 sm:w-11 shrink-0">
          <Image src="/logo.png" alt="PPF Logo" fill className="object-contain" />
        </div>
        <h1 className="font-futura text-lg font-black uppercase text-mono-plum">
          Policy Perspectives Foundation <span className="text-vibrant-violet">Admin Panel</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-vibrant-offwhite border border-vibrant-gray rounded-full px-4 py-2 gap-3">
          <Search className="w-4 h-4 text-vibrant-charcoal/40" />
          <input type="text" className="bg-transparent border-none outline-none text-sm w-48" placeholder="SEARCH SYSTEM..." />
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 rounded-xl transition-all border border-transparent hover:border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest">Logout</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-vibrant-violet border-2 border-white shadow-md flex items-center justify-center font-black text-xs text-white">AD</div>
      </div>
    </nav>
  );
}
