"use client";

import { motion } from "framer-motion";

interface Service {
  name: string;
  count: number;
}

export const ServicesRealized = ({ services }: { services: Service[] }) => {
  return (
    <section className="space-y-6">
      {/* Label da Seção */}
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]"
      >
        Serviços Realizados
      </motion.p>

      {/* Container de Scroll Horizontal */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-6 snap-x">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            whileTap={{ scale: 0.95 }}
            className="snap-center min-w-[160px] bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] flex flex-col justify-between aspect-square relative overflow-hidden group transition-colors hover:border-orange-600/30 will-change-transform"
          >
            {/* Número em Destaque (Orange) */}
            <div className="relative z-10">
              <span className="text-6xl font-black text-orange-600 tracking-tighter block group-hover:scale-110 transition-transform duration-500 origin-left">
                {service.count}
              </span>
            </div>

            {/* Nome do Serviço */}
            <div className="relative z-10">
              <span className="text-white font-black text-base leading-tight tracking-tight uppercase">
                {service.name}
              </span>
            </div>

            {/* Efeito de Brilho de Fundo Sutil */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-orange-600/5 blur-[40px] rounded-full group-hover:bg-orange-600/10 transition-all duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};