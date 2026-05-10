'use client';

import { 
  Calendar, 
  Package, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface IconFeatureProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
}

function FeatureItem({ icon, title, desc, index }: IconFeatureProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center md:text-left group relative"
    >
      {/* Background Glow sutil no hover (Acobreado) */}
      <div className="absolute -inset-4 bg-[#B87333]/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      <div className="relative z-10">
        <div className="mb-6 inline-block p-4 bg-white/[0.03] backdrop-blur-md rounded-[1.5rem] border border-white/5 group-hover:border-[#D49A62]/40 group-hover:bg-white/[0.06] transition-all duration-300 shadow-2xl">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-[#D49A62] drop-shadow-[0_0_8px_rgba(212,154,98,0.5)]"
          >
            {icon}
          </motion.div>
        </div>
        <h4 className="text-xl font-black mb-3 text-[#F7EFE2] tracking-tight transition-colors">
          {title}
        </h4>
        <p className="text-zinc-400 text-[15px] font-medium leading-relaxed max-w-sm mx-auto md:mx-0 group-hover:text-zinc-300 transition-colors">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export function IconFeatures() {
  const features = [
    { icon: <Calendar size={32} strokeWidth={2} />, title: "Agendamento online", desc: "Sua barbearia aberta 24h por dia para agendamentos automáticos sem precisar atender telefone." },
    { icon: <Package size={32} strokeWidth={2} />, title: "Controle de estoque", desc: "Gerencie pomadas, óleos e produtos de revenda com alertas automáticos de baixo estoque." },
    { icon: <Users size={32} strokeWidth={2} />, title: "Gestão de equipe", desc: "Calcule comissões automaticamente e controle a agenda de cada profissional individualmente." },
    { icon: <MessageSquare size={32} strokeWidth={2} />, title: "Suporte humanizado", desc: "Esqueça robôs. Nossa equipe de suporte fala sua língua e resolve seus problemas via WhatsApp." },
    { icon: <ShieldCheck size={32} strokeWidth={2} />, title: "Fluxo de caixa", desc: "Tenha relatórios financeiros detalhados de entradas e saídas para não perder um centavo." },
    { icon: <CheckCircle2 size={32} strokeWidth={2} />, title: "Avisos automáticos", desc: "Reduza o 'no-show' enviando lembretes automáticos para os clientes no WhatsApp." },
  ];

  return (
    <section className="w-full bg-[#050505] py-24 border-t border-white/5 overflow-hidden relative" id='beneficios'>
      {/* Background Effect Central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(184,115,51,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-16">
          {features.map((feature, idx) => (
            <FeatureItem 
              key={idx}
              index={idx}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}