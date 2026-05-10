'use client';

import { Star, Quote } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const testimonials = [
  {
    name: "Matheus Lopes",
    business: "Barbearia Elite",
    text: "O sistema é muito intuitivo. A parte de controle financeiro me ajuda demais a saber exatamente quanto estou faturando no mês.",
  },
  {
    name: "Anderson Silva",
    business: "Barber 013",
    text: "Não troco o BarberCenter por nada. A automação de lembretes reduziu minhas faltas em 70%. Cliente esqueceu? Nunca mais!",
  },
  {
    name: "Felipe Rezende",
    business: "Barbearia Central",
    text: "Tenho 3 profissionais na equipe e o app organiza cada um com seu horário e controle separado. Facilitou minha vida.",
  },
  {
    name: "Ricardo Gomes",
    business: "Dom Barba",
    text: "O melhor suporte que já tive. Estão sempre dispostos a ajudar e as atualizações são constantes.",
  },
];

const stats = [
  { value: 21.7, suffix: "mi", label: "Agendamentos" },
  { value: 8.9, suffix: "mil", label: "Barbearias" },
  { value: 173, suffix: "k", label: "Horas poupadas" },
  { value: 16.8, suffix: "mi", label: "Lembretes" },
];

function StatNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      +{count.toLocaleString('pt-BR', { minimumFractionDigits: value % 1 !== 0 ? 1 : 0, maximumFractionDigits: 1 })}{suffix}
    </span>
  );
}

export function Testimonials() {
  return (
    <section className="w-full bg-[#0A0A0A] py-16 md:py-24 overflow-hidden border-t border-white/5 relative">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_top,rgba(184,115,51,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-black text-[#F7EFE2] tracking-tighter leading-[1.1]">
            Veja o que nossos parceiros <br className="hidden md:block" /> falam sobre nós <span className="text-[#D49A62]">😎</span>
          </h2>
        </motion.div>

        {/* Slider Marquee Infinito */}
        <div className="relative -mx-6 md:-mx-12 lg:-mx-16">
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none hidden md:block" />
          
          <div className="flex overflow-hidden">
            <motion.div 
              className="flex space-x-6 md:space-x-8 py-8 px-6 md:px-12 lg:px-16"
              animate={{ x: [0, -1920] }} 
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              whileHover={{ animationPlayState: 'paused' }}
            >
              {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
                <div 
                  key={index} 
                  className="w-[280px] sm:w-[350px] md:w-[420px] flex-shrink-0 bg-[#050505] p-7 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/5 relative group transition-all duration-500 hover:-translate-y-2 hover:border-[#B87333]/30"
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex text-[#D49A62]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <span className="text-sm font-black text-[#F7EFE2]">5.0</span>
                  </div>

                  <p className="text-zinc-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium italic relative z-10">
                    "{item.text}"
                  </p>

                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D49A62] to-[#B87333] rounded-[1.2rem] flex items-center justify-center text-[#050505] font-black text-lg shadow-[0_5px_15px_rgba(184,115,51,0.25)] uppercase border border-[#B87333]/50">
                      {item.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-black text-[#F7EFE2] tracking-tight">{item.name}</h4>
                      <p className="text-[10px] text-[#B87333] uppercase font-black tracking-widest mt-0.5">{item.business}</p>
                    </div>
                  </div>

                  <Quote 
                    className="absolute top-8 right-8 text-white/5 group-hover:text-[#B87333]/10 transition-colors duration-500 z-0" 
                    size={64} 
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4 md:gap-x-8 mt-16 md:mt-24 pt-12 md:pt-20 border-t border-white/5">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center lg:items-start group">
              <p className="text-[2.5rem] sm:text-5xl md:text-6xl font-black text-[#F7EFE2] mb-2 tracking-tighter group-hover:text-[#D49A62] transition-colors duration-300">
                <StatNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "2.5rem" }}
                className="h-1.5 bg-gradient-to-r from-[#D49A62] to-[#B87333] mb-4 rounded-full group-hover:w-16 transition-all duration-300"
              />
              <p className="text-[10px] md:text-xs text-zinc-500 uppercase font-black tracking-[0.25em] text-center lg:text-left">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}