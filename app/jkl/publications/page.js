"use client";

import { useState, useEffect } from "react";
import PublicationsTab from "@/components/admin/PublicationsTab";

export default function PublicationsPage() {
  const [adminPublications, setAdminPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPublications = async () => {
    try {
      const { data } = await fetch(`/api/admin/publications?t=${Date.now()}`, { credentials: "include" }).then(r => r.json());
      if (data) setAdminPublications(data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleDeletePublication = async (id) => {
    try {
      await fetch(`/api/admin/publications/${id}`, { method: "DELETE", credentials: "include" });
      fetchPublications();
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
    <PublicationsTab
      publications={adminPublications}
      onRefetch={fetchPublications}
      onDelete={handleDeletePublication}
    />
  );
}
