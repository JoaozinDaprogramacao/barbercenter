"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  X,
  User,
  ChevronLeft,
  Share2,
  Users
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const userName = status === "loading" ? "..." : session?.user?.name || "Usuário";
  const userRole = status === "loading"
    ? "..."
    : session?.user?.role === "OWNER"
      ? "Administrador"
      : "Barbeiro";

  const menuItems = [
    { name: "Agenda", icon: <CalendarDays size={22} />, href: "/admin" },
    { name: "Faturamento", icon: <BarChart3 size={22} />, href: "/admin/analytics" },
    { name: "Clientes", icon: <Users size={22} />, href: "/admin/clientes" },
    { name: "Configurações", icon: <Settings size={22} />, href: "/admin/settings" },
    { name: "Compartilhar", icon: <Share2 size={22} />, href: "/admin/share" },
  ];

  const handleLogout = async () => {
    onClose();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm will-change-opacity"
          />

          {/* Sidebar - Posicionada na Direita */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[100] flex h-full w-[300px] flex-col border-l border-zinc-900 bg-black shadow-2xl will-change-transform"
          >
            {/* Header com Logo PNG (Removido texto BarberCenter) */}
            <div className="flex flex-row-reverse items-center justify-between p-8">
              <button 
                onClick={onClose} 
                className="p-1 text-zinc-500 transition-colors hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Logo da Barbearia" 
                  className="h-12 w-auto object-contain drop-shadow-xl" 
                />
              </div>
            </div>

            {/* Perfil */}
            <div className="mb-8 px-6">
              <div className="flex items-center gap-4 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#B87333]/20 bg-[#B87333]/10 text-[#C88A52]">
                  <User size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-black text-white">{userName}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#B87333]/70">{userRole}</p>
                </div>
                <ChevronLeft size={16} className="shrink-0 text-zinc-700" />
              </div>
            </div>

            {/* Menu Itens */}
            <nav className="flex-1 space-y-2 px-6">
              {menuItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#B87333] text-[#F7EFE2] shadow-lg shadow-[#B87333]/20'
                          : 'text-zinc-500 hover:bg-zinc-900 hover:text-[#F7EFE2]'
                      }`}
                    >
                      <span className={`${isActive ? 'text-white' : 'text-[#C88A52] transition-transform group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span className="text-sm tracking-tight">{item.name}</span>
                      
                      {/* Indicador de aba ativa */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute right-0 h-6 w-1.5 rounded-l-full bg-white"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer / Logout */}
            <div className="border-t border-zinc-900 p-8">
              <motion.button
                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest text-red-500 transition-all"
              >
                <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
                Sair da Conta
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};