"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck } from "lucide-react";

type Referral = { code: string; name: string; instagram: string | null };

/**
 * Tarja de continuidade da indicação.
 *
 * O visitante acabou de ver o embaixador falando do produto num Reel. Sem isso,
 * ele cai numa landing genérica e a confiança que o criador construiu evapora
 * no clique — que é justamente o ativo pelo qual estamos pagando 50%.
 *
 * Busca no cliente de propósito: o cookie é httpOnly e a LP é estática. Ler o
 * cookie no servidor tornaria a página inteira dinâmica para renderizar uma
 * linha de texto.
 */
export function ReferralBanner({ variant = "hero" }: { variant?: "hero" | "compact" }) {
    const [referral, setReferral] = useState<Referral | null>(null);

    useEffect(() => {
        let active = true;

        fetch("/api/ref/current")
            .then((r) => (r.ok ? r.json() : { referral: null }))
            .then((data) => { if (active) setReferral(data.referral); })
            .catch(() => { });

        return () => { active = false; };
    }, []);

    return (
        <AnimatePresence>
            {referral && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={
                        variant === "hero"
                            ? "inline-flex items-center gap-2.5 rounded-full border border-[#B87333]/30 bg-[#B87333]/10 px-4 py-2 backdrop-blur-sm"
                            : "flex items-center gap-2.5 rounded-2xl border border-[#B87333]/20 bg-[#B87333]/[0.07] px-4 py-3"
                    }
                >
                    <BadgeCheck size={16} className="shrink-0 text-[#D49A62]" />
                    <p className="text-xs font-medium text-zinc-300">
                        Indicado por{" "}
                        <span className="font-black text-[#D49A62]">{referral.name}</span>
                        {referral.instagram && (
                            <span className="ml-1 text-zinc-500">{referral.instagram}</span>
                        )}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
