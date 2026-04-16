'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Benefícios', href: '#beneficios' },
    { name: 'Preços', href: '#precos' },
    { name: 'Dúvidas', href: '#duvidas' },
  ];

  return (
    // 1. O Wrapper externo evita a "faixa preta" pois ele já ocupa o espaço com fundo branco
    <div className="w-full bg-white h-20 relative z-[100]">
      <motion.nav 
        initial={{ y: -80 }} // Começa escondido logo acima
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Ease suave
        className="fixed top-0 left-0 w-full bg-white border-b border-slate-100"
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-12 flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo BarberCenter" 
              className="h-12 w-auto object-contain shrink-0" 
            />
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

          {/* Botões */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden md:block text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2">
              Login
            </button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-tight shadow-lg shadow-orange-200"
            >
              Teste Grátis
            </motion.button>
            
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-t border-slate-100 md:hidden overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-5">
                {links.map((link) => (
                  <a key={link.name} href={link.href} className="text-base font-bold text-slate-600">
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}