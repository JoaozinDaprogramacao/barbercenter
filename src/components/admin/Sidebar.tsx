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
  ChevronLeft, // Alterado de ChevronRight para Left
  Share2
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] will-change-opacity"
          />

          {/* Sidebar - Posicionada na Direita */}
          <motion.aside
            initial={{ x: "100%" }} // Começa fora da tela à direita
            animate={{ x: 0 }}      // Desliza para a posição 0
            exit={{ x: "100%" }}    // Sai para a direita
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[300px] bg-black border-l border-zinc-900 z-[100] flex flex-col shadow-2xl will-change-transform"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between flex-row-reverse"> {/* Invertido para o X ficar no canto interno ou manter padrão */}
              <button 
                onClick={onClose} 
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3">
                <img src="/logo-white.png" alt="Logo" className="h-8 w-auto object-contain" />
                <h2 className="text-lg font-black text-white tracking-tighter uppercase">
                  Barber<span className="text-orange-600">Center</span>
                </h2>
              </div>
            </div>

            {/* Perfil */}
            <div className="px-6 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center text-orange-600 shrink-0">
                  <User size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white font-black text-sm truncate">{userName}</p>
                  <p className="text-orange-600/50 text-[10px] uppercase font-black tracking-widest">{userRole}</p>
                </div>
                <ChevronLeft size={16} className="text-zinc-700 shrink-0" />
              </div>
            </div>

            {/* Menu Itens */}
            <nav className="flex-1 px-6 space-y-2">
              {menuItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }} // Entra vindo da direita
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                          : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span className={`${isActive ? 'text-white' : 'text-orange-600 group-hover:scale-110 transition-transform'}`}>
                        {item.icon}
                      </span>
                      <span className="tracking-tight text-sm">{item.name}</span>
                      
                      {/* Indicador de aba ativa agora na direita do item */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute right-0 w-1.5 h-6 bg-white rounded-l-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-8 border-t border-zinc-900">
              <motion.button
                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                Sair da Conta
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};