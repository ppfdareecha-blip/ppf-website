"use client";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";

export default function TeamCard({ member, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(member)}
      className="group h-[320px] w-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 15vw"
          className="object-cover transition-all duration-500"
        />
      </div>

      <div className="flex h-20 flex-col items-center justify-center px-4 text-center">
        <h3 className="text-[14px] font-lora font-black text-slate-900 leading-tight">{member.name}</h3>
        <p className="mt-1 text-[9px] font-lato uppercase tracking-[0.2em] text-ppf-purple font-black">
          {member.designation}
        </p>
      </div>
    </button>
  );
}
