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

    // Tela de carregamento enquanto o cadeado trabalha (Refatorada)
    if (!isReady) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center border-x border-white/5 max-w-md mx-auto">
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#B87333]/20 blur-xl rounded-full" />
                    <Loader2 className="animate-spin text-[#D49A62] relative z-10 mb-6 drop-shadow-[0_0_15px_rgba(184,115,51,0.5)]" size={56} strokeWidth={2.5} />
                </div>
                <p className="text-[#B87333] font-black tracking-[0.25em] uppercase text-[10px] animate-pulse">
                    Sincronizando seu acesso...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center overflow-hidden relative border-x border-white/5">
            
            {/* Efeitos de fundo Premium */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,rgba(184,115,51,0.12),transparent_60%)]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(212,154,98,0.1),transparent_70%)]" />
            </div>

            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 20, stiffness: 100 }}
                className="relative z-10 mb-10"
            >
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#B87333]/30 bg-gradient-to-b from-[#B87333]/20 to-[#050505] shadow-[0_0_40px_rgba(184,115,51,0.25)] backdrop-blur-md">
                    <div className="absolute inset-0 rounded-full border border-white/5" />
                    <CheckCircle2 size={72} className="text-[#D49A62] drop-shadow-[0_0_15px_rgba(212,154,98,0.6)]" strokeWidth={2.5} />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 max-w-sm w-full flex flex-col items-center"
            >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B87333] mb-3">
                    Pagamento Aprovado
                </p>

                <h1 className="text-[2.5rem] font-black text-[#F7EFE2] mb-5 tracking-tighter leading-tight">
                    Tudo certo, <br/>
                    <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">
                        {session?.user?.name?.split(' ')[0] || 'Parceiro'}!
                    </span>
                </h1>
                
                <p className="text-zinc-400 font-medium text-[15px] mb-12 leading-relaxed">
                    Sua assinatura foi processada com sucesso. Seu acesso ao <strong className="text-[#F7EFE2]">BarberCenter PRO</strong> já está ativo e pronto para decolar sua barbearia.
                </p>

                <button
                    onClick={() => router.push('/admin')}
                    className="w-full bg-gradient-to-r from-[#D49A62] to-[#B87333] hover:brightness-110 text-[#050505] py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(184,115,51,0.25)]"
                >
                    Acessar Meu Painel
                    <ArrowRight size={22} strokeWidth={2.5} />
                </button>
            </motion.div>
        </div>
    );
}