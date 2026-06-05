"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ActivitiesContent from "@/components/activities/ActivitiesContent";
import Footer from "@/components/Footer";

export default function Activities() {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
        <ActivitiesContent />
      </Suspense>
      <Footer/>
    </div>
  );
}
