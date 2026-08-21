"use client";

import { useState, useEffect } from "react";
import AuthorsTab from "@/components/admin/AuthorsTab";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuthors = async () => {
    try {
      const { data } = await fetch(`/api/admin/authors?t=${Date.now()}`, { credentials: "include" }).then(r => r.json());
      if (data) setAuthors(data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 border-4 border-mono-plum/20 border-t-mono-plum rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthorsTab
      authors={authors}
      onRefetch={fetchAuthors}
    />
  );
}
