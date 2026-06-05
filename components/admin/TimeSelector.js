"use client";
import { useEffect } from "react";

export default function TimeSelector({ value, onChange, placeholder }) {
  const match = value ? value.match(/(\d+):(\d+)\s+(AM|PM)/) : null;
  const h = match ? match[1] : '10';
  const m = match ? match[2] : '00';
  const p = match ? match[3] : 'AM';

  useEffect(() => {
    if (!value) onChange(`${h}:${m} ${p}`);
  }, [value, h, m, p, onChange]);

  return (
    <div className="flex gap-2 w-full p-4 bg-vibrant-offwhite rounded-2xl border-2 border-transparent focus-within:border-vibrant-violet items-center">
      <span className="text-vibrant-charcoal/50 text-sm whitespace-nowrap">{placeholder}:</span>
      <select value={h} onChange={(e) => onChange(`${e.target.value}:${m} ${p}`)} className="bg-transparent outline-none text-vibrant-charcoal font-medium appearance-none text-center min-w-[2rem]">
        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(hr => <option key={hr} value={hr}>{hr}</option>)}
      </select>
      <span className="text-vibrant-charcoal font-medium">:</span>
      <select value={m} onChange={(e) => onChange(`${h}:${e.target.value} ${p}`)} className="bg-transparent outline-none text-vibrant-charcoal font-medium appearance-none text-center min-w-[2rem]">
        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(min => <option key={min} value={min}>{min}</option>)}
      </select>
      <select value={p} onChange={(e) => onChange(`${h}:${m} ${e.target.value}`)} className="bg-transparent outline-none text-vibrant-charcoal font-medium ml-2 appearance-none">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
