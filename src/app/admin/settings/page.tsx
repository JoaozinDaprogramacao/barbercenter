"use client";

import { useRouter } from "next/navigation";
import { SettingsView } from "@/components/admin/settings/SettingsView";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen">
      {/* Passamos o router.back() para o componente. 
          Assim, quando clicar na seta de voltar, ele retorna para a Agenda.
      */}
      <SettingsView onBack={() => router.back()} />
    </div>
  );
}