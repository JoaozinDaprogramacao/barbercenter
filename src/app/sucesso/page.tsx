"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SucessoPage() {
    const router = useRouter();
    const { update, data: session, status } = useSession();
    const [isReady, setIsReady] = useState(false);
    
    // O CADEADO: Garante que a atualização rode apenas UMA VEZ
    const hasSynced = useRef(false);

    useEffect(() => {
        // Se ainda está carregando, não faz nada
        if (status === "loading") return;

        // Se não estiver logado, manda pro login
        if (status === "unauthenticated") {
            router.push('/');
            return;
        }

        // Se está logado E a trava ainda está aberta
        if (status === "authenticated" && !hasSynced.current) {
            hasSynced.current = true; // Fecha a trava imediatamente!

            const syncSession = async () => {
                try {
                    // Busca o status real no banco (essencial para pagamentos via Cartão)
                    const userId = (session?.user as any)?.id;
                    if (userId) {
                        const res = await fetch(`/api/user/plan-status?userId=${userId}`);
                        const dbData = await res.json();

                        // Atualiza a sessão passando o novo status explicitamente para o JWT
                        if (dbData.planStatus === 'PRO') {
                            await update({ planStatus: 'PRO' });
                        } else {
                            await update(); 
                        }
                    }
                } catch (error) {
                    console.error("Erro ao sincronizar sessão", error);
                } finally {
                    setIsReady(true); // Libera a tela
                }
            };

            syncSession();
        }
    }, [status, router, update, session]);

    // Tela de carregamento enquanto o cadeado trabalha
    if (!isReady) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#10B981] mb-4" size={48} />
                <p className="text-zinc-400 font-bold tracking-widest uppercase text-sm animate-pulse">
                    Sincronizando seu acesso...
                </p>
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
                    Tudo certo, {session?.user?.name?.split(' ')[0] || 'Parceiro'}!
                </h1>
                
                <p className="text-zinc-400 font-medium text-lg mb-12 leading-relaxed">
                    O pagamento foi processado com sucesso. Seu acesso ao <strong className="text-white">InBarber PRO</strong> já está ativo e pronto para decolar sua barbearia.
                </p>

                <button
                    onClick={() => router.push('/admin')}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-6 rounded-[2rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-emerald-900/20"
                >
                    Acessar Meu Painel
                    <ArrowRight size={24} />
                </button>
            </motion.div>
        </div>
    );
}