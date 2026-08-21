"use client";

import { useState, useEffect } from "react";
import MembersTab from "@/components/admin/MembersTab";
import { MemberOpinionModal } from "@/components/admin/AdminModals";

export default function MembersPage() {
  const [pendingOpinions, setPendingOpinions] = useState([]);
  const [selectedMemberOpinion, setSelectedMemberOpinion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const { data } = await fetch(`/api/admin/opinions/pending?t=${Date.now()}`, { credentials: "include" }).then(r => r.json());
      if (data) setPendingOpinions(data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApproveMember = async (id) => {
    try {
      const res = await fetch(`/api/admin/opinions/${id}`, { method: "PUT", credentials: "include" });
      if (res.ok) {
        setSelectedMemberOpinion(null);
        fetchPending();
      }
    } catch (e) { console.error(e); }
  };

  const handleRejectMember = async (id) => {
    try {
      const res = await fetch(`/api/admin/opinions/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { 
        setSelectedMemberOpinion(null); 
        fetchPending(); 
      }
    } catch (e) { console.error(e); }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 border-4 border-mono-plum/20 border-t-mono-plum rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <MembersTab
        pendingOpinions={pendingOpinions}
        onSelectOpinion={setSelectedMemberOpinion}
      />
      {selectedMemberOpinion && (
        <MemberOpinionModal
          opinion={selectedMemberOpinion}
          onClose={() => setSelectedMemberOpinion(null)}
          onApprove={handleApproveMember}
          onReject={handleRejectMember}
        />
      )}
    </>
  );
}
