'use client';

import { Smartphone, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReferralBanner } from './ReferralBanner';
import { trackEvent } from '@/lib/track-client';

export function Hero() {
  return (
    <section className="w-full bg-[#050505] overflow-hidden relative">
      {/* Efeitos Radiais Acobreados no Fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(184,115,51,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[50%] bg-[radial-gradient(circle,rgba(212,154,98,0.10),transparent_60%)] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
        
        {/* Lado Esquerdo */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="pb-8 md:pb-24"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-[#F7EFE2] tracking-tighter">
            Simplifique a forma como você administra <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent italic">seu negócio</span>
          </h1>
          <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-zinc-400 max-w-md font-medium leading-relaxed">
            Tenha o controle total da sua barbearia na palma da mão. Agendamento online, finanças e equipe em um só lugar.
          </p>

          {/* Quem chegou por link de embaixador vê de quem veio a indicação. */}
          <div className="mt-6 empty:mt-0">
            <ReferralBanner />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 w-fit">
            {/* A primeira dobra precisa de ação: antes disso, o único botão da
                página ficava no menu ou a quatro seções de scroll daqui. */}
            <Link
              href="/registro"
              onClick={() => trackEvent('CTA_CLICK', { key: 'hero' })}
              className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D49A62] to-[#B87333] px-8 py-4 text-sm font-black uppercase tracking-widest text-[#1A0F07] shadow-lg shadow-[#B87333]/20 transition-all hover:shadow-xl hover:shadow-[#B87333]/30 active:scale-95"
            >
              Começar grátis
              <ArrowRight size={16} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 px-5 py-3 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#D49A62] animate-pulse" />
              <span className="text-xs font-black text-zinc-300 tracking-widest uppercase">
                45 dias grátis · Sem cartão
              </span>
            </div>
          </div>
        </motion.div>

        {/* Lado Direito - Mockup */}
        <div className="hidden md:flex relative justify-center h-full min-h-[600px]">
          <motion.div 
            initial={{ opacity: 0, y: "30%" }}
            animate={{ opacity: 1, y: "20%" }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-[380px] h-[700px] lg:h-[780px] lg:-mt-32 bg-[#050505] rounded-3xl border-[6px] border-[#111] shadow-[0_50px_100px_-20px_rgba(184,115,51,0.2)] overflow-hidden transform ring-1 ring-white/10"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <div className="absolute top-0 left-0 w-full h-14 flex items-center justify-between px-8 z-20 pointer-events-none">
                <div className="w-16 flex justify-start">
                  <span className="text-white text-[14px] font-semibold tracking-wide">9:41</span>
                </div>
                <div className="w-32 h-8 bg-black rounded-full flex items-center justify-end px-3 border border-white/10">
                  <div className="w-2.5 h-2.5 bg-[#B87333] rounded-full shadow-[0_0_5px_rgba(184,115,51,0.8)]"></div>
                </div>
                <div className="w-16 flex items-center justify-end space-x-1.5 text-white">
                  <svg className="w-[16px] h-[12px]" viewBox="0 0 18 12" fill="currentColor"><rect x="1" y="8" width="3" height="4" rx="1"/><rect x="5.5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="14.5" y="0" width="3" height="12" rx="1"/></svg>
                  <svg className="w-[16px] h-[12px]" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5.5C4.5 2.5 11.5 2.5 14.5 5.5M4 8C6 6 10 6 12 8M8 11.5v.01" /></svg>
                  <svg className="w-[24px] h-[12px]" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeWidth="1"/><rect x="2.5" y="2.5" width="17" height="7" rx="1.5" fill="currentColor"/><path d="M24 4V8C24.5523 8 25 7.55228 25 7V5C25 4.44772 24.5523 4 24 4Z" fill="currentColor"/></svg>
                </div>
              </div>
              <Image
                src="/tela-hero.png"
                alt="Interface do BarberCenter"
                fill
                className="object-cover object-top rounded-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Cards Flutuantes Premium */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, delay: 0.5 }}
            className="absolute top-20 -right-4 bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 border border-white/10 origin-right"
          >
            <p className="text-[10px] font-black text-[#D49A62] uppercase tracking-[0.25em]">Confirmado</p>
            <p className="text-3xl font-black text-[#F7EFE2] tracking-tighter mt-1">34</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
            transition={{ y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }, delay: 0.7 }}
            className="absolute top-1/2 -left-8 bg-[#B87333]/10 backdrop-blur-xl p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 border border-[#B87333]/30 origin-left"
          >
            <p className="text-[10px] font-black text-[#D49A62] uppercase tracking-[0.25em]">Hoje</p>
            <p className="text-3xl font-black text-[#F7EFE2] tracking-tighter mt-1">16</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}