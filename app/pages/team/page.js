"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamContent from "@/components/team/TeamContent";

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <TeamContent />
      <Footer />
    </main>
  );
}
