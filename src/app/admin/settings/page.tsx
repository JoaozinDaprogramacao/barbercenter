"use client";

import { useRouter } from "next/navigation";
import { SettingsView } from "@/components/admin/settings/SettingsView";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen">
      <SettingsView onBack={() => router.back()} />
    </div>
  );
}