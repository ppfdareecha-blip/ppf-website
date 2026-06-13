"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TeamCard from "@/components/team/TeamCard";
import TeamModal from "./TeamModal";
import teamData from "@/data/Team.json";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function TeamSection({ title, members, onMemberClick }) {
  return (
    <div className="mb-24 px-4 sm:px-0">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-xl md:text-2xl font-lora font-black text-[#001D4A] tracking-tighter uppercase whitespace-nowrap">
          {title}
        </h2>
        <div className="h-[2px] flex-grow bg-slate-100"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr gap-x-4 gap-y-10"
      >
        {members.map((member) => (
          <motion.div 
            key={member.name} 
            variants={itemVariants} 
            className="h-full relative scroll-mt-32"
            id={member.name.replace(/\s+/g, '-').toLowerCase()}
          >
            <TeamCard member={member} onClick={onMemberClick} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function TeamContent() {
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedMember ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMember]);

  const { governingCouncil, distinguishedFellows } = teamData;

  return (
    <>
      <section className="bg-white pt-24 md:pt-24 pb-4">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-900 pb-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-7xl font-lora font-black text-slate-900 tracking-tighter"
              >
                Expert <span className="text-ppf-purple">Council.</span>
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 container mx-auto px-6 max-w-7xl">
        <TeamSection title="Governing Council" members={governingCouncil} onMemberClick={setSelectedMember} />
        <TeamSection title="Distinguished Fellows" members={distinguishedFellows} onMemberClick={setSelectedMember} />

      </section>

      <TeamModal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} member={selectedMember} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

export default TeamContent;
