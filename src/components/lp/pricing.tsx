'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Users, Crown } from 'lucide-react';
import Link from 'next/link';

const FOUNDING_SPOTS_LEFT = 63;
const FOUNDING_SPOTS_TOTAL = 100;
const FOUNDING_SPOTS_TAKEN = FOUNDING_SPOTS_TOTAL - FOUNDING_SPOTS_LEFT;

type BillingCycle = 'monthly' | 'annual';

interface Plan {
  id: string;
  name: string;
  Icon: React.ElementType;
  price: { monthly: number; annual: number };
  founderPrice?: number;
  description: string;
  highlight: boolean;
  features: string[];
  missing: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    Icon: Zap,
    price: { monthly: 49.90, annual: 39.90 },
    description: 'Para barbers que trabalham sozinhos',
    highlight: false,
    features: [
      '1 profissional',
      'Agendamento online 24h',
      'Link personalizado de agendamento',
      'Lembretes automáticos no WhatsApp',
      'Controle financeiro',
      'Suporte via WhatsApp',
    ],
    missing: [
      'Comissões por profissional',
      'Controle de estoque',
      'Relatórios avançados',
    ],
    cta: 'Começar 45 dias grátis',
  },
  {
    id: 'profissional',
    name: 'Profissional',
    Icon: Users,
    price: { monthly: 79.90, annual: 63.90 },
    founderPrice: 49.90,
    description: 'Para barbearias com equipe',
    highlight: true,
    features: [
      'Até 4 profissionais',
      'Agendamento online 24h',
      'Link personalizado de agendamento',
      'Lembretes automáticos no WhatsApp',
      'Comissões automáticas por barber',
      'Controle de estoque com alertas',
      'Relatórios avançados de faturamento',
      'Suporte prioritário via WhatsApp',
    ],
    missing: [],
    cta: 'Garantir vaga de fundador',
  },
  {
    id: 'premium',
    name: 'Premium',
    Icon: Crown,
    price: { monthly: 129.90, annual: 103.90 },
    description: 'Para barbearias de grande porte',
    highlight: false,
    features: [
      'Profissionais ilimitados',
      'Tudo do Profissional',
      'Relatórios personalizados',
      'Onboarding dedicado',
      'Suporte com atendimento preferencial',
    ],
    missing: [],
    cta: 'Começar 45 dias grátis',
  },
];

function fmt(n: number) {
  return n.toFixed(2).replace('.', ',');
}

export function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  return (
    <section
      id="precos"
      className="w-full bg-[#050505] py-16 md:py-32 border-t border-white/5"
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D49A62] font-black uppercase tracking-[0.25em] text-xs mb-4"
          >
            Preços
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-5xl font-black text-[#F7EFE2] tracking-tighter mb-4"
          >
            Comece grátis. Assine só se amar.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto"
          >
            45 dias grátis, sem cartão de crédito. Cancele quando quiser.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <button
              onClick={() => setBilling('monthly')}
              className={`text-sm font-black transition-colors duration-200 ${
                billing === 'monthly' ? 'text-[#F7EFE2]' : 'text-zinc-500'
              }`}
            >
              Mensal
            </button>

            <button
              onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-12 h-6 rounded-full bg-white/10 border border-white/10 cursor-pointer"
              aria-label="Alternar cobrança"
            >
              <motion.div
                animate={{ x: billing === 'annual' ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute top-1 left-0 w-4 h-4 rounded-full bg-[#D49A62]"
              />
            </button>

            <button
              onClick={() => setBilling('annual')}
              className={`text-sm font-black flex items-center gap-2 transition-colors duration-200 ${
                billing === 'annual' ? 'text-[#F7EFE2]' : 'text-zinc-500'
              }`}
            >
              Anual
              <span className="bg-[#B87333]/20 text-[#D49A62] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#B87333]/20 uppercase tracking-wider">
                2 meses grátis
              </span>
            </button>
          </motion.div>
        </div>

        {/* Founder progress bar — only on monthly */}
        <AnimatePresence>
          {billing === 'monthly' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-5xl mx-auto mb-6 overflow-hidden"
            >
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[#D49A62] text-xs font-black uppercase tracking-[0.2em]">
                      🔥 Vagas de Fundador
                    </p>
                    <p className="text-zinc-400 text-xs font-bold">
                      <span className="text-[#F7EFE2] font-black">{FOUNDING_SPOTS_TAKEN}</span>/{FOUNDING_SPOTS_TOTAL} preenchidas
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(FOUNDING_SPOTS_TAKEN / FOUNDING_SPOTS_TOTAL) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-[#B87333] to-[#D49A62] rounded-full"
                    />
                  </div>
                </div>
                <p className="text-zinc-400 text-xs text-center sm:text-right shrink-0">
                  Fundadores pagam <span className="text-[#F7EFE2] font-black">R$49,90/mês</span> no plano<br className="hidden sm:block" />
                  Profissional para sempre — preço travado.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => {
            const isFounder = plan.id === 'profissional' && billing === 'monthly';
            const displayPrice = isFounder ? plan.founderPrice! : plan.price[billing];
            const originalPrice = plan.price.monthly;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-[2rem] p-6 md:p-8 border flex flex-col ${
                  plan.highlight
                    ? 'bg-[#F7EFE2] text-[#050505] border-[#F7EFE2] shadow-[0_24px_60px_-10px_rgba(247,239,226,0.15)]'
                    : 'bg-white/[0.02] text-[#F7EFE2] border-white/10'
                }`}
              >
                {/* Badge */}
                {isFounder && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#B87333] text-[#050505] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.18em]">
                    🔥 Preço de Fundador — {FOUNDING_SPOTS_LEFT} vagas
                  </div>
                )}
                {plan.highlight && !isFounder && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#B87333] text-[#050505] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.18em]">
                    Mais popular
                  </div>
                )}

                {/* Plan icon + name */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-xl ${plan.highlight ? 'bg-black/8' : 'bg-white/5'}`}>
                    <plan.Icon
                      size={18}
                      strokeWidth={2.5}
                      className={plan.highlight ? 'text-[#050505]' : 'text-[#D49A62]'}
                    />
                  </div>
                  <div>
                    <p className={`font-black text-sm ${plan.highlight ? 'text-[#050505]' : 'text-[#F7EFE2]'}`}>
                      {plan.name}
                    </p>
                    <p className={`text-xs leading-tight ${plan.highlight ? 'text-[#050505]/55' : 'text-zinc-500'}`}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-7">
                  {isFounder && (
                    <p className={`text-sm font-black line-through mb-0.5 ${plan.highlight ? 'text-[#050505]/35' : 'text-zinc-600'}`}>
                      R$ {fmt(originalPrice)}/mês
                    </p>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-black ${plan.highlight ? 'text-[#050505]/55' : 'text-zinc-400'}`}>
                      R$
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${plan.id}-${billing}-${isFounder}`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className={`text-4xl md:text-5xl font-black tracking-tighter leading-none ${
                          plan.highlight ? 'text-[#050505]' : 'text-[#F7EFE2]'
                        }`}
                      >
                        {fmt(displayPrice)}
                      </motion.span>
                    </AnimatePresence>
                    <span className={`text-sm font-black ${plan.highlight ? 'text-[#050505]/55' : 'text-zinc-400'}`}>
                      /mês
                    </span>
                  </div>

                  {billing === 'annual' && (
                    <p className={`text-xs mt-1.5 ${plan.highlight ? 'text-[#050505]/50' : 'text-zinc-500'}`}>
                      Cobrado anualmente · R$ {fmt(displayPrice * 12)}/ano
                    </p>
                  )}
                  {isFounder && (
                    <p className={`text-xs mt-1.5 font-black ${plan.highlight ? 'text-[#B87333]' : 'text-[#D49A62]'}`}>
                      Preço travado para sempre ↗
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={13}
                        strokeWidth={3}
                        className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-[#050505]' : 'text-[#D49A62]'}`}
                      />
                      <span className={`text-xs font-bold leading-tight ${plan.highlight ? 'text-[#050505]' : 'text-zinc-300'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                  {plan.missing.map(f => (
                    <li key={f} className="flex items-start gap-2.5 opacity-35">
                      <X size={13} strokeWidth={3} className="shrink-0 mt-0.5" />
                      <span className={`text-xs font-bold leading-tight line-through ${plan.highlight ? 'text-[#050505]' : 'text-zinc-500'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/registro" className="block outline-none">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-4 rounded-[1.2rem] font-black text-xs uppercase tracking-widest text-center cursor-pointer transition-all duration-200 ${
                      plan.highlight
                        ? 'bg-[#050505] text-[#F7EFE2] hover:bg-[#B87333]'
                        : 'bg-white/5 text-[#F7EFE2] border border-white/10 hover:bg-[#B87333]/20 hover:border-[#B87333]/40'
                    }`}
                  >
                    {plan.cta}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom trust notes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="text-center mt-10 space-y-2"
        >
          <p className="text-zinc-500 text-xs font-bold">
            Todos os planos incluem 45 dias grátis · Sem cartão de crédito · Cancele quando quiser
          </p>
          <p className="text-zinc-600 text-xs">
            🔒 SSL Seguro · Dados criptografados · Servidores seguros
          </p>
        </motion.div>

      </div>
    </section>
  );
}
