"use client";

import { useState, useEffect } from "react";
import CareersTab from "@/components/admin/CareersTab";

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCareers = async () => {
    try {
      const { data } = await fetch(`/api/admin/careers?t=${Date.now()}`, { credentials: "include" }).then(r => r.json());
      if (data) setCareers(data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleDeleteCareer = async (id) => {
    try {
      await fetch(`/api/admin/careers/${id}`, { method: "DELETE", credentials: "include" });
      fetchCareers();
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
    <CareersTab
      careers={careers}
      onRefetch={fetchCareers}
      onDelete={handleDeleteCareer}
    />
  );
}
