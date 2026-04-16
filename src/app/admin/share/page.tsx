"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
        <main className="min-h-screen w-full flex flex-col bg-black max-w-md mx-auto relative overflow-hidden font-sans border-x border-zinc-900">
            {/* Background Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-20 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
            </div>

            <SettingsHeader onBack={() => router.back()} />

            <div className="flex-1 px-6 pt-4 space-y-8 overflow-y-auto no-scrollbar pb-20 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Cresça seu negócio</p>
                    <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Compartilhar</h2>
                </motion.div>

                {/* CARD DO QR CODE */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-8 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={40} className="text-orange-600" />
                    </div>

                    <div className="w-56 h-56 bg-white rounded-[2.5rem] p-6 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] relative group">
                        {mounted && shareUrl ? (
                            <QRCode
                                value={shareUrl}
                                size={180}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                level="H"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 animate-pulse rounded-2xl" />
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white tracking-tight">Seu QR Code</h3>
                        <p className="text-sm text-zinc-500 font-medium max-w-[220px] mx-auto leading-relaxed">
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
                    <label className="text-[10px] font-black text-orange-600 uppercase px-2 tracking-[0.2em]">Link de Agendamento</label>

                    <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-[2rem] flex items-center gap-2 group transition-all focus-within:border-orange-600/50">
                        <div className="flex-1 px-4 overflow-hidden">
                            <p className="text-zinc-400 text-sm truncate font-bold">
                                {shareUrl ? shareUrl.replace(/^https?:\/\//, '') : "Gerando link..."}
                            </p>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCopy}
                            className={`p-4 rounded-2xl transition-all ${
                                copied ? 'bg-green-600 text-white' : 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
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
                        className="flex flex-col items-center justify-center gap-4 bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] hover:bg-zinc-800 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                            <Share2 size={26} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Enviar Link</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(shareUrl, '_blank')}
                        className="flex flex-col items-center justify-center gap-4 bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] hover:bg-zinc-800 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <ExternalLink size={26} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Ver Página</span>
                    </motion.button>
                </div>

                {/* DICA BOX */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-orange-600/5 border border-orange-600/10 p-7 rounded-[2.5rem] flex items-start gap-5 relative overflow-hidden"
                >
                    <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500 shrink-0">
                        <Sparkles size={22} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                        <strong className="text-orange-500 text-[11px] font-black uppercase tracking-widest block">Dica InBarber:</strong>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                            Coloque este link na sua <span className="text-white">Bio do Instagram</span> para automatizar sua agenda 24h por dia.
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}