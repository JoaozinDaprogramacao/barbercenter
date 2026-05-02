'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface CardProps {
  title: string;
  imgBg: string; // Cor de fundo da seção ao redor do telefone
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
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]); // Parallax interno suave

  return (
    <motion.div
      ref={cardRef}
      style={{ y: cardY }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:scale-[1.01] transition-transform duration-500 h-full group z-10"
    >
      <div className="p-8 pb-4 text-center flex flex-col items-center z-10">
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-[220px]">
          {title}
        </h3>
      </div>

      {/* Container da Área de Fundo do Mockup */}
      {/* Mudamos para items-start e pt-8 para alinhar no topo e cortar o final */}
      <div className={`mx-6 mt-4 flex-1 rounded-t-[2.5rem] ${imgBg} border-t border-x border-slate-100 p-6 pt-8 pb-0 shadow-inner min-h-[380px] md:min-h-[420px] flex items-start justify-center overflow-hidden relative`}>

        {/* --- ESTRUTURA DO TELEFONE (HARDWARE) --- */}
        <div className="w-full max-w-[280px] aspect-[775/1685] bg-black rounded-t-[2.5rem] border-[10px] border-b-0 border-black relative shadow-2xl transition-transform group-hover:translate-y-[-8px] duration-500 z-10">

          {/* Ilha Dinâmica */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-between px-2.5 border border-slate-800/50">
            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
            <div className="w-8 h-1 bg-slate-800 rounded-full" />
          </div>

          {/* Área da Tela */}
          {imgSrc && (
            // Adicionado border-b-0 e arredondamento apenas no topo para a tela
            <div className="absolute inset-0 w-full h-full top-0 overflow-hidden bg-black rounded-t-[1.5rem]">
              <motion.div
                style={{ y: imageY }}
                className="relative w-full h-full"
              >
                <Image
                  src={imgSrc}
                  alt={title}
                  fill
                  priority
                  // Mantido object-cover mt-10 para a imagem esticar e criar o teto preto da Ilha
                  className="object-cover object-top mt-10"
                />
              </motion.div>
            </div>
          )}

          {/* Reflexo */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none rounded-t-[1.5rem]" />

        </div>
      </div>
    </motion.div>
  );
}

// O FeatureCards permanece o mesmo, mas a imagem do primeiro card precisa ser a de Agendamento
export function FeatureCards() {
  return (
    <section className="w-full bg-white overflow-hidden pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-black rounded-[3rem] px-6 pt-20 pb-56 md:pt-24 md:pb-64 text-center relative z-0"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight tracking-tighter">
            Todas as ferramentas para o seu negócio na palma da sua mão
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-10 -mt-48 md:-mt-56 relative z-10">
          <Card
            title="Acompanhe seus agendamentos"
            imgBg="bg-slate-100"
            // Substitua pelo caminho real da imagem que você me enviou
            imgSrc="/imgs/lp/screen-agendamento.png"
            index={0}
          />
          <Card
            title="Personalize seu link de agendamento"
            imgBg="bg-zinc-900"
            imgSrc="/imgs/lp/screen-chat.png"
            index={1}
          />
          <Card
            title="Integre seu link com redes sociais"
            imgBg="bg-orange-100"
            imgSrc="/imgs/lp/screen-share.png"
            index={2}
          />
        </div>

      </div>
    </section>
  );
}