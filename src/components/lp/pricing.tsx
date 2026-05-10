'use client';

import { Smartphone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export function Pricing() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lightOrangeY = useTransform(scrollYProgress, [0, 1], [-50, 150]);
  const lightWhiteY = useTransform(scrollYProgress, [0, 1], [50, -150]); 
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);      
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]); 

  return (
    <section 
      id="precos" 
      ref={containerRef}
      className="w-full bg-[#050505] py-16 md:py-32 border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">
        
        <motion.div 
          style={{ scale }}
          className="max-w-5xl mx-auto bg-white/[0.02] text-[#F7EFE2] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 border border-white/10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          
          {/* Efeitos de Luz Parallax (Cobre e Ouro) */}
          <motion.div 
            style={{ y: lightOrangeY }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#B87333]/20 blur-[100px] md:blur-[150px] pointer-events-none transition-colors group-hover:bg-[#B87333]/30" 
          />
          <motion.div 
            style={{ y: lightWhiteY }}
            className="absolute -top-20 -left-20 w-60 h-60 bg-[#D49A62]/10 blur-[80px] md:blur-[120px] pointer-events-none" 
          />

          {/* Coluna da Esquerda: Textos */}
          <motion.div 
            style={{ y: contentY }}
            className="z-10 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 tracking-tighter">
              Tudo liberado para você.
            </h2>
            <p className="text-[#D49A62] font-black text-xl md:text-2xl mb-6 md:mb-8 tracking-tight italic">
              Experimente por 45 dias grátis
            </p>
            
            <div className="flex space-x-3 md:space-x-4">
              {[1, 2].map((i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="bg-white/5 p-3 md:p-4 rounded-[1.2rem] border border-white/10 hover:border-[#B87333]/50 hover:bg-[#B87333]/10 transition-all duration-300 shadow-inner"
                >
                  <Smartphone size={26} className="text-zinc-500 group-hover:text-[#D49A62] transition-colors" strokeWidth={2} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Coluna da Direita: Preço e Botão */}
          <motion.div 
            style={{ y: contentY }}
            className="mt-12 md:mt-0 text-center z-10 flex flex-col items-center md:items-end w-full md:w-auto"
          >
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-[#B87333]/10 text-[#D49A62] text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.25em] mb-5 border border-[#B87333]/20"
            >
              Cancele quando quiser
            </motion.div>
            
            <p className="text-zinc-500 line-through text-base md:text-lg font-bold mb-1 tracking-wider">R$ 49,90</p>
            
            <div className="flex items-baseline text-[#F7EFE2]">
              <span className="text-xl md:text-2xl font-black mr-2 text-zinc-500">R$</span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-[4rem] sm:text-[5rem] lg:text-[6.5rem] font-black tracking-tighter leading-none"
              >
                32,90
              </motion.span>
              <span className="text-base md:text-lg text-zinc-500 ml-2 font-black">/mês</span>
            </div>
            
            <p className="text-[10px] md:text-xs text-zinc-500 mt-4 font-black uppercase tracking-[0.2em]">
              Após os 45 dias gratuitos
            </p>
            
            {/* CTA */}
            <Link href="/registro" className="mt-8 w-full md:w-auto block outline-none">
              <motion.div 
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#B87333",
                  color: "#050505",
                  boxShadow: "0 20px 40px -10px rgba(184, 115, 51, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#F7EFE2] text-[#050505] px-12 py-5 rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xl"
              >
                Começar Gratuitamente
              </motion.div>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}