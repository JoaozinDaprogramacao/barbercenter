"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { useRouter } from "next/navigation";
import { Copy, Check, Share2, ExternalLink } from "lucide-react"; // Tirei o QrCode daqui
import QRCode from "react-qr-code"; // <-- Importamos a biblioteca real

export default function SharePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false); // Para evitar erro de hidratação no Next.js

    useEffect(() => {
        setMounted(true);
    }, []);

    // Geramos o link com base no ID da barbearia na sessão
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
        <main className="h-[100dvh] w-full flex flex-col bg-background max-w-md mx-auto overflow-hidden animate-in fade-in duration-500">
            <SettingsHeader onBack={() => router.back()} />

            <div className="flex-1 px-6 pt-4 space-y-8 overflow-y-auto no-scrollbar pb-10">
                <div>
                    <p className="text-white/40 text-sm font-medium mb-1">Cresça seu negócio</p>
                    <h2 className="text-4xl font-black text-white tracking-tight leading-none">Compartilhar</h2>
                </div>

                {/* CARD DO QR CODE REAL */}
                <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-48 h-48 bg-white rounded-3xl p-4 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                        {mounted && shareUrl ? (
                            <QRCode
                                value={shareUrl}
                                size={160} // Tamanho exato para preencher o quadrado
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                level="H" // Alta qualidade para leitura mais fácil
                            />
                        ) : (
                            // Esqueleto de carregamento enquanto o link não está pronto
                            <div className="w-full h-full bg-gray-200 animate-pulse rounded-2xl" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Seu QR Code</h3>
                        <p className="text-sm text-white/40 max-w-[200px] mx-auto">
                            Mostre para seus clientes no balcão para agendamentos rápidos.
                        </p>
                    </div>
                </div>

                {/* SEÇÃO DO LINK */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-accent uppercase px-1 tracking-[0.2em]">Seu Link de Agendamento</label>

                    <div className="bg-surface border border-white/10 p-2 rounded-2xl flex items-center gap-2 group">
                        <div className="flex-1 px-4 overflow-hidden">
                            <p className="text-white/60 text-sm truncate font-medium">
                                {shareUrl ? shareUrl.replace(/^https?:\/\//, '') : "Gerando link..."}
                            </p>
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`p-4 rounded-xl transition-all active:scale-90 ${copied ? 'bg-green-500 text-black' : 'bg-white/5 text-white'
                                }`}
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>

                {/* BOTÕES DE AÇÃO RÁPIDA */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                        onClick={handleShare}
                        className="flex flex-col items-center justify-center gap-3 bg-accent/10 border border-accent/20 p-6 rounded-[32px] hover:bg-accent/20 transition-all active:scale-95 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                            <Share2 size={24} />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">Enviar Link</span>
                    </button>

                    <button
                        onClick={() => window.open(shareUrl, '_blank')}
                        className="flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 p-6 rounded-[32px] hover:bg-white/10 transition-all active:scale-95 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <ExternalLink size={24} />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">Ver Página</span>
                    </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[32px] flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                        <Check size={20} />
                    </div>
                    <p className="text-xs text-blue-100/60 leading-relaxed">
                        <strong className="text-blue-400 block mb-1 uppercase tracking-tighter">Dica InBarber:</strong>
                        Coloque este link na sua <strong>Bio do Instagram</strong> para automatizar sua agenda 24h por dia.
                    </p>
                </div>
            </div>
        </main>
    );
}