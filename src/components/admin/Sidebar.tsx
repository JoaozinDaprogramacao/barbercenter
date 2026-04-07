"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react"; // <-- Adicionamos o useSession aqui
import {
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  X,
  User,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  // 1. Puxamos a sessão do usuário logado
  const { data: session, status } = useSession();

  // 2. Formatamos o nome e a função (Role)
  const userName = status === "loading" ? "..." : session?.user?.name || "Usuário";
  const userRole = status === "loading"
    ? "..."
    : session?.user?.role === "OWNER"
      ? "Administrador"
      : "Barbeiro"; // Caso no futuro você adicione funcionários

  const menuItems = [
    { name: "Agenda", icon: <CalendarDays size={22} />, href: "/admin" },
    { name: "Faturamento", icon: <BarChart3 size={22} />, href: "/admin/analytics" },
    { name: "Configurações", icon: <Settings size={22} />, href: "/admin/settings" },
  ];

  const handleLogout = async () => {
    onClose();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Overlay (Fundo escuro com blur) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Menu Lateral */}
      <aside className={`fixed top-0 left-0 h-full w-[300px] bg-background border-r border-white/5 z-[100] transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>

        {/* Header da Sidebar */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="font-black text-white text-lg">IB</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">InBarber</h2>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Card de Perfil Rápido */}
        <div className="px-6 mb-8">
          <div className="bg-surface border border-white/5 rounded-3xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <User size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              {/* 3. Injetamos o nome dinâmico com truncate para não quebrar o layout se o nome for gigante */}
              <p className="text-white font-bold text-sm truncate">{userName}</p>
              {/* 4. Injetamos o cargo dinâmico */}
              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">{userRole}</p>
            </div>
            <ChevronRight size={16} className="text-white/10 shrink-0" />
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 group ${isActive
                    ? 'bg-accent text-white shadow-xl shadow-accent/20 translate-x-2'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-accent group-hover:scale-110 transition-transform'}`}>
                  {item.icon}
                </span>
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botão de Logout */}
        <div className="p-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black uppercase tracking-widest text-[11px] hover:bg-red-500/5 rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Sair da Conta
          </button>
        </div>
      </aside>
    </>
  );
};