"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OpinionsTab from "@/components/admin/OpinionsTab";
import {
  OpinionViewModal,
  OpinionEditModal,
  DownloadableLinkModal,
} from "@/components/admin/AdminModals";

export default function OpinionsPage() {
  const router = useRouter();
  const [adminOpinions, setAdminOpinions] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedOpinionView, setSelectedOpinionView] = useState(null);
  const [editingOpinion, setEditingOpinion] = useState(null);
  const [linkOpinion, setLinkOpinion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminOpinions = async () => {
    try {
      const { data } = await fetch(`/api/admin/opinions-manage?t=${Date.now()}`, { credentials: "include" }).then(r => r.json());
      if (data) setAdminOpinions(data);
    } catch (e) { console.error(e); }
  };

  const fetchAuthors = async () => {
    try {
      const { data } = await fetch(`/api/admin/authors?t=${Date.now()}`, { credentials: "include" }).then(r => r.json());
      if (data) setAuthors(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    Promise.all([fetchAdminOpinions(), fetchAuthors()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleDeleteOpinion = async (id) => {
    try {
      await fetch(`/api/admin/opinions-manage/${id}`, { method: "DELETE", credentials: "include" });
      fetchAdminOpinions();
      fetchAuthors(); // Update author counts
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
      <OpinionsTab
        opinions={adminOpinions}
        authors={authors}
        onSwitchToAuthorsTab={() => router.push("/jkl/authors")}
        onRefetch={() => {
          fetchAdminOpinions();
          fetchAuthors();
        }}
        onView={setSelectedOpinionView}
        onEdit={setEditingOpinion}
        onDelete={handleDeleteOpinion}
        onAddLink={setLinkOpinion}
      />

      {selectedOpinionView && (
        <OpinionViewModal opinion={selectedOpinionView} onClose={() => setSelectedOpinionView(null)} />
      )}
      
      {editingOpinion && (
        <OpinionEditModal
          opinion={editingOpinion}
          authors={authors}
          onClose={() => setEditingOpinion(null)}
          onSaved={() => {
            fetchAdminOpinions();
            fetchAuthors();
          }}
        />
      )}
      
      {linkOpinion && (
        <DownloadableLinkModal
          opinion={linkOpinion}
          onClose={() => setLinkOpinion(null)}
          onSaved={() => {
            fetchAdminOpinions();
            fetchAuthors();
          }}
        />
      )}
    </>
  );
}
