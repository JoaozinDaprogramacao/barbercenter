"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Agenda", icon: "📅", href: "/admin" },
    { name: "Faturamento", icon: "📊", href: "/admin/analytics" },
    { name: "Configurações", icon: "⚙️", href: "/admin/settings" },
  ];

  return (
    <>
      {/* Overlay (Fundo escuro) */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-[40] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Menu Lateral */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-[#0A0A0A] border-r border-white/5 z-[50] transition-transform duration-300 ease-out p-6 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex items-center gap-3 mb-12 pt-4">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-black text-white">IB</div>
          <h2 className="text-xl font-bold text-white tracking-tight">InBarber</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:bg-white/5'}`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button className="mt-auto p-4 flex items-center gap-4 text-red-500 font-bold hover:bg-red-500/10 rounded-2xl transition-all">
          <span>🚪</span> Sair
        </button>
      </aside>
    </>
  );
};