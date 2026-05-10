'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Benefícios', href: '#beneficios' },
        { name: 'Preços', href: '#precos' },
        { name: 'Dúvidas', href: '#duvidas' },
    ];

    return (
        <div className="w-full bg-[#050505] h-20 relative z-[100]">
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 w-full bg-[#050505]/90 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-screen-2xl mx-auto px-4 md:px-12 flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        {/* Se tiver uma logo dourada/branca substitua, senão o brightness ajuda */}
                        <img
                            src="/logo.png"
                            alt="Logo BarberCenter"
                            className="h-12 w-auto object-contain shrink-0 drop-shadow-[0_2px_10px_rgba(184,115,51,0.3)]"
                        />
                        <span className="hidden sm:block text-xl font-black text-[#F7EFE2] tracking-tighter uppercase leading-none mt-1">
                            Barber<span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Center</span>
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-[13px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#D49A62] transition-all relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#D49A62] transition-all group-hover:w-full rounded-full" />
                            </a>
                        ))}
                    </div>

                    {/* Botões */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        <Link
                            href="/login"
                            className="text-[13px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#F7EFE2] transition-colors"
                        >
                            Login
                        </Link>

                        <Link href="/registro">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_5px_15px_rgba(184,115,51,0.25)] will-change-transform hover:brightness-110"
                            >
                                Teste Grátis
                            </motion.button>
                        </Link>

                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-[#F7EFE2] transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
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
                            className="bg-[#0A0A0A] border-t border-white/5 md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col p-6 gap-6">
                                {links.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-sm font-black uppercase tracking-widest text-zinc-300 hover:text-[#D49A62]"
                                    >
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