'use client';

import { useState } from 'react';
import { Smartphone, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Benefícios', href: '#beneficios' },
    { name: 'Preços', href: '#precos' },
    { name: 'Dúvidas', href: '#duvidas' },
  ];

  return (
    <nav className="relative w-full bg-white border-b border-slate-100 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-12 flex items-center justify-between h-20">
        
        {/* Logo - Resumida no Mobile */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 shrink-0">
            <Smartphone size={20} className="text-white" strokeWidth={3} />
          </div>
          <span className="hidden sm:block text-xl font-black text-slate-900 tracking-tighter uppercase">
            Barber<span className="text-orange-600">Center</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[15px] font-bold text-slate-500 hover:text-slate-900 transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full rounded-full" />
            </a>
          ))}
        </div>

        {/* Botão Principal e Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden md:block text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 transition-colors">
            Login
          </button>
          
          <button className="bg-orange-600 text-white px-4 py-2.5 sm:px-7 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[12px] sm:text-sm uppercase tracking-tight hover:bg-orange-700 transition-all active:scale-95 shadow-md shadow-orange-100">
            Teste Grátis
          </button>
          
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div className={`
        absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out md:hidden overflow-hidden
        ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
      `}>
        <div className="flex flex-col p-6 gap-5">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-bold text-slate-600 hover:text-orange-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="h-[1px] bg-slate-100 w-full my-1" />
          
          <button className="text-left text-base font-bold text-slate-900 flex items-center gap-2">
            Fazer Login
          </button>
        </div>
      </div>
    </nav>
  );
}