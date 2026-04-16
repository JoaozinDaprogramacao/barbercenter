'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface CardProps {
  title: string;
  imgBg: string;
  imgSrc?: string;
  index: number; // Adicionado para stagger
}

function Card({ title, imgBg, imgSrc, index }: CardProps) {
  const cardRef = useRef(null);

  // Hook do Framer Motion para rastrear o scroll relativo ao card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"] // Começa quando o topo do card entra na tela, termina quando o fundo sai
  });

  // 1. Parallax do Card Inteiro (Sutil)
  // O card sobe levemente mais rápido que o scroll da página
  const cardY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // 2. Parallax da Imagem Interna (Mais Intenso)
  // A imagem rola para baixo dentro do mockup enquanto o usuário rola a página para baixo
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ y: cardY }} // Aplica o parallax no card
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:scale-[1.01] transition-transform duration-500 h-full group"
    >
      <div className="p-8 pb-4 text-center flex flex-col items-center z-10">
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-[220px]">
          {title}
        </h3>
      </div>
      
      {/* Container do Mockup com Parallax Interno */}
      <div className={`mx-6 mt-4 flex-1 rounded-t-[2.5rem] ${imgBg} border-t border-x border-slate-100 p-6 pb-0 shadow-inner aspect-[4/5] min-h-[380px] md:min-h-[480px] flex items-start justify-center overflow-hidden`}>
        <div className="w-full h-full bg-slate-200 rounded-t-[2rem] border-t border-x border-slate-300 relative shadow-2xl transition-transform group-hover:translate-y-[-6px] duration-500 overflow-hidden">
          
          {/* StatusBar Mockup */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-400/20 rounded-full z-20" />
          
          {imgSrc && (
            // Este container é necessário para que a imagem possa "transbordar" e mover dentro
            <div className="absolute inset-0 w-full h-[120%] -top-[10%] rounded-t-[2rem] overflow-hidden">
              <motion.div 
                style={{ y: imageY }} // Aplica o parallax na imagem
                className="relative w-full h-full"
              >
                <Image 
                  src={imgSrc} 
                  alt={title} 
                  fill 
                  className="object-cover object-top pt-12 rounded-t-[2rem]"
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function FeatureCards() {
  return (
    <section className="w-full bg-white overflow-hidden pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        
        {/* Retângulo Preto Responsivo */}
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

        {/* Grid de Cards - Ajustado o z-index para flutuar sobre o preto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-10 -mt-48 md:-mt-56 relative z-10">
          <Card 
            title="Acompanhe seus agendamentos" 
            imgBg="bg-slate-50" 
            imgSrc="/mockup-1.png"
            index={0}
          />
          <Card 
            title="Personalize seu link de agendamento" 
            imgBg="bg-zinc-900" 
            imgSrc="/mockup-2.png"
            index={1}
          />
          <Card 
            title="Integre seu link com redes sociais" 
            imgBg="bg-orange-50" 
            imgSrc="/mockup-3.png"
            index={2}
          />
        </div>

      </div>
    </section>
  );
}