'use client';

import { Smartphone, Star } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Lado Esquerdo - Seu layout original com animação de entrada */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="pb-8 md:pb-24"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900 tracking-tight">
            Simplifique a forma como você administra <span className="text-orange-600">seu negócio</span>
          </h1>
          <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-md font-medium">
            Tenha o controle total da sua barbearia na palma da mão. Agendamento online, estoque e equipe em um só lugar.
          </p>

          
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <span className="text-sm font-bold text-slate-700 tracking-tight">+3.5 mil avaliações</span>
          </div>
        </motion.div>

        {/* Lado Direito - Layout original 100% preservado */}
        <div className="hidden md:flex relative justify-center h-full min-h-[600px]">
          {/* Mockup do Celular com animação de flutuação e entrada */}
          <motion.div 
            initial={{ opacity: 0, y: "30%" }} // Começa um pouco mais abaixo
            animate={{ opacity: 1, y: "20%" }}   // Termina no seu translate-y-[20%] original
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-[380px] h-[700px] lg:h-[780px] lg:-mt-32 bg-slate-900 rounded-3xl border-[6px] border-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden transform"
          >
            {/* Animação contínua interna para não quebrar o container pai */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <div className="absolute top-0 left-0 w-full h-14 flex items-center justify-between px-8 z-20 pointer-events-none">
                <div className="w-16 flex justify-start">
                  <span className="text-white text-[14px] font-semibold tracking-wide">9:41</span>
                </div>
                <div className="w-32 h-8 bg-black rounded-full flex items-center justify-end px-3">
                  <div className="w-2.5 h-2.5 bg-slate-800/80 rounded-full"></div>
                </div>
                <div className="w-16 flex items-center justify-end space-x-1.5 text-white">
                  {/* ... seus SVGs originais ... */}
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

          {/* Card Confirmado - Posição original com animação bounce */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, delay: 0.5 }}
            className="absolute top-20 -right-4 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-slate-100 origin-right"
          >
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confirmado</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tighter">34</p>
          </motion.div>

          {/* Card Hoje - Posição original com animação bounce */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
            transition={{ y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }, delay: 0.7 }}
            className="absolute top-1/2 -left-8 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-slate-100 origin-left"
          >
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hoje</p>
            <p className="text-2xl font-bold text-orange-600 tracking-tighter">16</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}