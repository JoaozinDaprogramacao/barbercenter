'use client';

import { Smartphone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Pricing() {
  const containerRef = useRef(null);

  // Hook para capturar o progresso do scroll nesta seção específica
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Movimentos de Parallax coordenados
  const lightOrangeY = useTransform(scrollYProgress, [0, 1], [-50, 150]); // Luz laranja desce
  const lightWhiteY = useTransform(scrollYProgress, [0, 1], [50, -150]);  // Luz branca sobe
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);      // Conteúdo flutua levemente
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]); // Pulsa sutilmente no scroll

  return (
    <section 
      id="precos" 
      ref={containerRef}
      className="w-full bg-black py-16 md:py-32 border-t border-zinc-900/50 overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">
        
        <motion.div 
          style={{ scale }}
          className="max-w-5xl mx-auto bg-zinc-900/40 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 border border-zinc-800/50 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group backdrop-blur-sm"
        >
          
          {/* Efeitos de Luz Parallax (Fundo) */}
          <motion.div 
            style={{ y: lightOrangeY }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-600/20 blur-[100px] md:blur-[150px] pointer-events-none transition-colors group-hover:bg-orange-600/30" 
          />
          <motion.div 
            style={{ y: lightWhiteY }}
            className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 blur-[80px] md:blur-[120px] pointer-events-none" 
          />

          {/* Coluna da Esquerda: Textos (Com leve parallax) */}
          <motion.div 
            style={{ y: contentY }}
            className="z-10 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <h2 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-3 tracking-tight">
              Quais são os planos?
            </h2>
            <p className="text-orange-500 font-bold text-lg md:text-2xl mb-6 md:mb-8 tracking-tight italic">
              Experimente por 45 dias grátis
            </p>
            
            <div className="flex space-x-3 md:space-x-4">
              {[1, 2].map((i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300"
                >
                  <Smartphone size={24} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
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
              className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 border border-orange-500/20"
            >
              Oferta de Lançamento
            </motion.div>
            
            <p className="text-zinc-500 line-through text-base md:text-lg font-medium mb-1">R$ 49,90</p>
            
            <div className="flex items-baseline text-white">
              <span className="text-xl md:text-2xl font-bold mr-1 text-zinc-400">R$</span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter"
              >
                32,90
              </motion.span>
              <span className="text-base md:text-lg text-zinc-500 ml-2 font-medium">/mês</span>
            </div>
            
            <p className="text-[10px] md:text-sm text-zinc-400 mt-4 font-bold uppercase tracking-[0.15em]">
              No plano semestral
            </p>
            
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#f97316",
                boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full md:w-auto bg-white text-black px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300"
            >
              Assinar Agora
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}