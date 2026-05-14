"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SettingsHeader } from "@/components/admin/settings/layout/SettingsHeader";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Check, Share2, ExternalLink, Sparkles } from "lucide-react";
import QRCode from "react-qr-code";

export default function SharePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const shareUrl = typeof window !== "undefined" && session?.user?.barbershopId
        ? `${window.location.origin}/agendar/${session.user.barbershopId}`
        : "";

    const handleCopy = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Agende seu horário no InBarber",
                    text: "Agora você pode agendar seu horário direto pelo meu link!",
                    url: shareUrl,
                });
            } catch (err) {
                console.log("Erro ao compartilhar");
            }
        } else {
            handleCopy();
        }
    };

    return (
        <main className="min-h-screen w-full flex flex-col bg-[#050505] max-w-md mx-auto relative overflow-hidden font-sans border-x border-white/5">
            
            {/* Efeitos de Fundo Premium (Glows em tons de Cobre/Dourado) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.15),transparent_50%)]" />
                <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(circle_at_bottom_left,rgba(212,154,98,0.10),transparent_50%)]" />
            </div>

            <div className="relative z-10">
                <SettingsHeader onBack={() => router.back()} />
            </div>

            <div className="flex-1 px-6 pt-4 space-y-8 overflow-y-auto no-scrollbar pb-20 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 text-[#B87333]">
                        Cresça seu negócio
                    </p>
                    <h2 className="text-[2.65rem] font-black leading-none tracking-tighter text-[#F7EFE2]">
                        Compartilhar <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Link</span>
                    </h2>
                </motion.div>

                {/* CARD DO QR CODE (Glassmorphism Premium) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative flex flex-col items-center space-y-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-30">
                        <Sparkles size={36} className="text-[#D49A62]" />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 rounded-full bg-[#B87333]/20 blur-2xl" />
                        <div className="relative z-10 flex h-56 w-56 items-center justify-center rounded-[2.5rem] border-4 border-white/5 bg-white p-6 shadow-[0_0_40px_rgba(184,115,51,0.15)]">
                            {mounted && shareUrl ? (
                                <QRCode
                                    value={shareUrl}
                                    size={180}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    level="H"
                                />
                            ) : (
                                <div className="h-full w-full animate-pulse rounded-2xl bg-zinc-200" />
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight text-[#F7EFE2]">Seu QR Code</h3>
                        <p className="mx-auto max-w-[220px] text-sm font-medium leading-relaxed text-zinc-400">
                            Mantenha no balcão para seus clientes agendarem em segundos.
                        </p>
                    </div>
                </motion.div>

                {/* SEÇÃO DO LINK */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#B87333]/80">Link de Agendamento</label>

                    <div className="flex items-center gap-2 rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-2 transition-all focus-within:border-[#B87333]/50 shadow-inner group">
                        <div className="flex-1 overflow-hidden px-4">
                            <p className="truncate text-sm font-bold text-[#F7EFE2]">
                                {shareUrl ? shareUrl.replace(/^https?:\/\//, '') : "Gerando link..."}
                            </p>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCopy}
                            className={`rounded-[1.5rem] p-4 transition-all ${
                                copied 
                                ? 'bg-white/[0.05] border border-white/10 text-white' 
                                : 'bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] shadow-[0_5px_15px_rgba(184,115,51,0.25)] hover:brightness-110'
                            }`}
                        >
                            {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={3} />}
                        </motion.button>
                    </div>
                </motion.div>

                {/* BOTÕES DE AÇÃO RÁPIDA */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="group flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-[#B87333]/40 hover:bg-white/[0.06]"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#B87333]/30 bg-[#B87333]/10 text-[#D49A62] transition-transform group-hover:scale-110">
                            <Share2 size={26} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#F7EFE2]">Enviar Link</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(shareUrl, '_blank')}
                        className="group flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-[#B87333]/40 hover:bg-white/[0.06]"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#111111] text-zinc-400 transition-transform group-hover:scale-110 group-hover:border-[#B87333]/30 group-hover:text-[#D49A62]">
                            <ExternalLink size={26} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#F7EFE2]">Ver Página</span>
                    </motion.button>
                </div>

                {/* DICA BOX */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative flex items-start gap-5 overflow-hidden rounded-[2.5rem] border border-[#B87333]/20 bg-gradient-to-br from-[#B87333]/10 to-transparent p-7 shadow-lg"
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#B87333]/20 bg-[#B87333]/20 text-[#D49A62]">
                        <Sparkles size={22} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1 pt-1">
                        <strong className="block text-[11px] font-black uppercase tracking-widest text-[#D49A62]">Dica InBarber:</strong>
                        <p className="text-xs font-medium leading-relaxed text-zinc-400">
                            Coloque este link na sua <span className="font-bold text-[#F7EFE2]">Bio do Instagram</span> para automatizar sua agenda 24h por dia.
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}