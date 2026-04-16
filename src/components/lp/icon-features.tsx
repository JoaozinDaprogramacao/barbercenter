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
      {/* Background Glow sutil no hover */}
      <div className="absolute -inset-4 bg-orange-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      <div className="relative">
        <div className="mb-6 inline-block p-4 bg-zinc-900 rounded-2xl border border-zinc-800 group-hover:border-orange-500/50 group-hover:bg-zinc-800 transition-all duration-300 shadow-2xl">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-orange-500"
          >
            {icon}
          </motion.div>
        </div>
        <h4 className="text-xl font-bold mb-3 text-white tracking-tight group-hover:text-orange-50 transition-colors">
          {title}
        </h4>
        <p className="text-zinc-400 text-base leading-relaxed max-w-sm mx-auto md:mx-0 group-hover:text-zinc-300 transition-colors">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export function IconFeatures() {
  const features = [
    { icon: <Calendar size={32} />, title: "Agendamento online", desc: "Sua barbearia aberta 24h por dia para agendamentos automáticos sem precisar atender telefone." },
    { icon: <Package size={32} />, title: "Controle de estoque", desc: "Gerencie pomadas, óleos e produtos de revenda com alertas automáticos de baixo estoque." },
    { icon: <Users size={32} />, title: "Gestão de equipe", desc: "Calcule comissões automaticamente e controle a agenda de cada profissional individualmente." },
    { icon: <MessageSquare size={32} />, title: "Suporte humanizado", desc: "Esqueça robôs. Nossa equipe de suporte fala sua língua e resolve seus problemas via WhatsApp." },
    { icon: <ShieldCheck size={32} />, title: "Fluxo de caixa", desc: "Tenha relatórios financeiros detalhados de entradas e saídas para não perder um centavo." },
    { icon: <CheckCircle2 size={32} />, title: "Avisos automáticos", desc: "Reduza o 'no-show' enviando lembretes automáticos para os clientes no WhatsApp." },
  ];

  return (
    <section className="w-full bg-black py-24 border-t border-zinc-900/50 overflow-hidden" id='beneficios'>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">
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