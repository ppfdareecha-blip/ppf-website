"use client";

import { useContext } from "react";
import SettingsTab from "@/components/admin/SettingsTab";
import { AdminContext } from "../layout";

export default function SettingsPage() {
  const admin = useContext(AdminContext);

  return <SettingsTab admin={admin} />;
}
