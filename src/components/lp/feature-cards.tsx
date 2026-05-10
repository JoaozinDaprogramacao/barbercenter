'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface CardProps {
  title: string;
  imgBg: string;
  imgSrc?: string;
  index: number;
}

function Card({ title, imgBg, imgSrc, index }: CardProps) {
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y: cardY }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col bg-white/[0.03] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden hover:scale-[1.02] hover:border-[#B87333]/30 transition-all duration-500 h-full group z-10 backdrop-blur-md"
    >
      <div className="p-8 pb-4 text-center flex flex-col items-center z-10">
        <h3 className="text-xl font-black text-[#F7EFE2] leading-tight tracking-tight max-w-[220px]">
          {title}
        </h3>
      </div>

      <div className={`mx-6 mt-4 flex-1 rounded-t-[2.5rem] ${imgBg} border-t border-x border-white/10 p-6 pt-8 pb-0 shadow-inner min-h-[380px] md:min-h-[420px] flex items-start justify-center overflow-hidden relative`}>
        <div className="w-full max-w-[280px] aspect-[775/1685] bg-[#050505] rounded-t-[2.5rem] border-[10px] border-b-0 border-[#111] relative shadow-2xl transition-transform group-hover:translate-y-[-8px] duration-500 z-10">

          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#050505] rounded-full z-30 flex items-center justify-between px-2.5 border border-white/5">
            <div className="w-1.5 h-1.5 bg-[#B87333]/80 rounded-full" />
            <div className="w-8 h-1 bg-[#111] rounded-full" />
          </div>

          {imgSrc && (
            <div className="absolute inset-0 w-full h-full top-0 overflow-hidden bg-[#050505] rounded-t-[1.5rem]">
              <motion.div style={{ y: imageY }} className="relative w-full h-full">
                <Image
                  src={imgSrc}
                  alt={title}
                  fill
                  priority
                  className="object-cover object-top mt-10"
                />
              </motion.div>
            </div>
          )}

          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none rounded-t-[1.5rem]" />
        </div>
      </div>
    </motion.div>
  );
}

export function FeatureCards() {
  return (
    <section className="w-full bg-[#0A0A0A] overflow-hidden pb-10 border-t border-white/5 relative">
      {/* Background Detail */}
      <div className="absolute top-1/4 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(184,115,51,0.05),transparent_60%)] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-[#050505] rounded-[3rem] px-6 pt-20 pb-56 md:pt-24 md:pb-64 text-center relative z-0 border border-[#B87333]/20 shadow-[0_0_50px_rgba(184,115,51,0.15)]"
        >
          <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_top,rgba(212,154,98,0.1),transparent_50%)]" />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#F7EFE2] max-w-4xl mx-auto leading-tight tracking-tighter relative z-10">
            Todas as ferramentas para o seu negócio <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent italic">na palma da mão</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-10 -mt-48 md:-mt-56 relative z-10">
          <Card
            title="Acompanhe seus agendamentos"
            imgBg="bg-[#111111]"
            imgSrc="/imgs/lp/screen-agendamento.png"
            index={0}
          />
          <Card
            title="Personalize seu link de agendamento"
            imgBg="bg-[#0c0c0c]"
            imgSrc="/imgs/lp/screen-chat.png"
            index={1}
          />
          <Card
            title="Integre seu link com redes sociais"
            imgBg="bg-gradient-to-b from-[#B87333]/10 to-[#111111]"
            imgSrc="/imgs/lp/screen-share.png"
            index={2}
          />
        </div>

      </div>
    </section>
  );
}