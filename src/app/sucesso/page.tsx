"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SucessoPage() {
    const router = useRouter();
    const { update, data: session, status } = useSession();
    const [isUpdatingSession, setIsUpdatingSession] = useState(true);

    useEffect(() => {
        const syncSession = async () => {
            if (status === "authenticated") {
                // Força a atualização do token JWT para pegar o status PRO do banco
                await update();
                setIsUpdatingSession(false);
            } else if (status === "unauthenticated") {
                // Se não estiver logado, manda pro login
                router.push('/');
            }
        };

        syncSession();
    }, [status, update, router]);

    if (isUpdatingSession || status === "loading") {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#10B981] mb-4" size={48} />
                <p className="text-zinc-400 font-bold tracking-widest uppercase text-sm animate-pulse">Sincronizando seu acesso...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
            {/* Efeitos de fundo */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-[#10B981]/10 blur-[100px] rounded-full" />
            </div>

            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 15 }}
                className="relative z-10"
            >
                <CheckCircle2 size={120} className="text-[#10B981] mb-8 mx-auto drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 max-w-md w-full"
            >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                    Tudo certo, {session?.user?.name?.split(' ')[0]}!
                </h1>
                
                <p className="text-zinc-400 font-medium text-lg mb-12 leading-relaxed">
                    O pagamento foi processado com sucesso. Seu acesso ao <strong className="text-white">InBarber PRO</strong> já está ativo e pronto para decolar sua barbearia.
                </p>

                <button
                    onClick={() => router.push('/dashboard')} // Ou a rota principal do seu admin
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-6 rounded-[2rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-emerald-900/20"
                >
                    Acessar Meu Painel
                    <ArrowRight size={24} />
                </button>
            </motion.div>
        </div>
    );
}