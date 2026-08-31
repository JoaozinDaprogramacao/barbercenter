'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { trackEvent } from '@/lib/track-client';

export function FreeTrial() {
    return (
        <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,115,51,0.12),transparent_65%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-2xl mx-auto text-center relative z-10"
            >
                <p className="text-[10px] font-black text-[#D49A62] uppercase tracking-[0.35em] mb-5">
                    Sem risco · Sem cartão
                </p>

                <h2 className="text-4xl md:text-6xl font-black text-[#F7EFE2] tracking-tighter leading-[1.05]">
                    45 dias para provar que{' '}
                    <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent italic">
                        vale cada centavo
                    </span>
                </h2>

                <p className="mt-6 text-zinc-400 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                    Crie sua conta agora, configure em menos de 5 minutos e comece a usar. Sem burocracia.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/registro" onClick={() => trackEvent('CTA_CLICK', { key: 'free-trial' })}>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(184,115,51,0.3)]"
                        >
                            Começar grátis agora
                            <ArrowRight size={18} strokeWidth={3} />
                        </motion.button>
                    </Link>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#B87333]" />
                        45 dias 100% grátis
                    </span>
                    <span className="hidden sm:block text-zinc-700">·</span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#B87333]" />
                        Sem cartão de crédito
                    </span>
                    <span className="hidden sm:block text-zinc-700">·</span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#B87333]" />
                        Cancele quando quiser
                    </span>
                </div>
            </motion.div>
        </section>
    );
}
