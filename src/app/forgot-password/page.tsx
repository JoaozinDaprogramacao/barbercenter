"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const whatsappNumber = "5538988654816";
    const message = encodeURIComponent("Olá! Esqueci minha senha no BarberCenter e gostaria de solicitar a redefinição.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] px-6 relative overflow-hidden font-sans">
            
            {/* Efeitos de Fundo Premium (Glows em tons de Cobre/Dourado) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(184,115,51,0.15),transparent_60%)]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(212,154,98,0.10),transparent_60%)]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm z-10 text-center flex flex-col items-center will-change-transform"
            >
                <Link 
                    href="/login" 
                    className="group inline-flex items-center gap-2 text-zinc-500 hover:text-[#D49A62] transition-colors mb-10"
                >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Voltar ao Login</span>
                </Link>

                <div className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-md p-8 rounded-[2.5rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <div className="mb-8">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#B87333]/30 bg-gradient-to-b from-[#B87333]/20 to-[#050505] mb-6 shadow-[0_0_20px_rgba(184,115,51,0.2)]">
                            <MessageCircle size={28} className="text-[#D49A62]" strokeWidth={2} />
                        </div>
                        
                        <h1 className="text-[2rem] font-black text-[#F7EFE2] uppercase tracking-tighter leading-none mb-3">
                            Recuperar <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Acesso</span>
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                            Por questões de segurança, a troca de senha é feita manualmente pelo nosso suporte.
                        </p>
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-14 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black uppercase tracking-widest text-xs rounded-[1.5rem] shadow-[0_10px_25px_rgba(37,211,102,0.2)] transition-all flex items-center justify-center gap-3 hover:brightness-110 active:scale-95"
                    >
                        <MessageCircle size={20} strokeWidth={2.5} />
                        Chamar no WhatsApp
                    </a>

                    <p className="mt-8 text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em] leading-relaxed">
                        Atendimento de Segunda a Sábado <br /> em horário comercial.
                    </p>
                </div>
            </motion.div>
        </main>
    );
}