'use client';

import { motion } from 'framer-motion';
import { CalendarCheck, TrendingUp, BellRing, Users, PackageCheck, HeartHandshake } from 'lucide-react';

const benefits = [
  {
    Icon: BellRing,
    headline: 'Até 70% menos no-show',
    body: 'Lembretes automáticos via WhatsApp avisam o cliente antes do horário. Cadeira vazia vira exceção, não rotina.',
  },
  {
    Icon: CalendarCheck,
    headline: 'Agenda lotada sem esforço',
    body: 'Seu link de agendamento fica aberto 24h. Clientes marcam enquanto você dorme — sem WhatsApp, sem ligação.',
  },
  {
    Icon: TrendingUp,
    headline: 'Faturamento no bolso da mão',
    body: 'Saiba exatamente quanto entrou, quanto saiu e qual serviço mais rende. Sem planilha, sem chute.',
  },
  {
    Icon: Users,
    headline: 'Comissões sem briga',
    body: 'Cada barber vê sua própria agenda e comissão calculada automaticamente. Transparência que fideliza equipe.',
  },
  {
    Icon: PackageCheck,
    headline: 'Estoque sob controle',
    body: 'Alerta automático quando o produto está acabando. Nunca mais pegar de surpresa no meio do atendimento.',
  },
  {
    Icon: HeartHandshake,
    headline: 'Suporte humano de verdade',
    body: 'Problema? Nossa equipe responde pelo WhatsApp — pessoa real, sem bot, na sua língua.',
  },
];

export function Testimonials() {
  return (
    <section className="w-full bg-[#0A0A0A] py-16 md:py-24 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_top,rgba(184,115,51,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-[#D49A62] font-black uppercase tracking-[0.25em] text-xs mb-4">
            O que muda na sua barbearia
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F7EFE2] tracking-tighter leading-[1.1]">
            Resultado real.<br className="hidden md:block" /> Sem enrolação.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.headline}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white/[0.02] border border-white/8 rounded-[2rem] p-7 md:p-8 hover:border-[#B87333]/30 hover:bg-[#B87333]/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#B87333]/10 border border-[#B87333]/20 flex items-center justify-center mb-5 group-hover:bg-[#B87333]/20 transition-colors duration-300">
                <b.Icon size={20} className="text-[#D49A62]" strokeWidth={2} />
              </div>
              <h3 className="text-[#F7EFE2] font-black text-base md:text-lg tracking-tight mb-2">
                {b.headline}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {b.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
