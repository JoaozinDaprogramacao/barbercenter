'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRegister } from '@/hooks/use-register';
import { ReferralBanner } from '@/components/lp/ReferralBanner';
import { PageTracker } from '@/components/tracking/PageTracker';
import { trackEvent } from '@/lib/track-client';

export default function RegisterPage() {
  const { register: registerUser, isLoading, error: registerError } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Erro no cadastro é uma das maiores fugas do funil — "e-mail já cadastrado"
  // faz a pessoa fechar a aba achando que não consegue entrar.
  useEffect(() => {
    if (registerError) trackEvent('SIGNUP_ERROR', { key: registerError.slice(0, 60), once: false });
  }, [registerError]);

  /**
   * Envolve o register() do react-hook-form para medir o preenchimento campo a
   * campo, sem substituir o onBlur original.
   *
   * Só o NOME do campo é enviado, nunca o valor: o que a pessoa digitou —
   * inclusive a senha — jamais sai do navegador por aqui.
   */
  const trackedRegister = (name: string, options?: Parameters<typeof register>[1]) => {
    const field = register(name, options);

    return {
      ...field,
      onFocus: () => trackEvent('SIGNUP_START'),
      onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value.trim()) trackEvent('SIGNUP_FIELD', { key: name });
        return field.onBlur(event);
      },
    };
  };

  const benefits = [
    "45 dias totalmente grátis",
    "Não precisa de cartão de crédito",
    "Acesso total a todas as ferramentas",
    "Suporte humanizado via WhatsApp"
  ];

  const onSubmit = (data: any) => {
    trackEvent('SIGNUP_SUBMIT');
    registerUser(data);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row font-sans overflow-hidden">
      <PageTracker step="SIGNUP_VIEW" />

      {/* LADO ESQUERDO: MARKETING (Oculto no mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] p-12 lg:p-24 flex-col justify-between relative border-r border-white/5">
        {/* Efeitos Radiais Premium */}
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(184,115,51,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,154,98,0.1),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16 group">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain drop-shadow-[0_5px_15px_rgba(184,115,51,0.2)] transition-transform group-hover:scale-105" />
            <span className="text-[1.35rem] font-black text-[#F7EFE2] tracking-tighter uppercase leading-none">
              Barber<span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Center</span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-black text-[#F7EFE2] leading-tight tracking-tighter mb-8">
              Comece a transformar sua barbearia <span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent italic">hoje mesmo.</span>
            </h1>

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-[#B87333]/20 to-transparent border border-[#B87333]/30 text-[#D49A62] shadow-[0_0_15px_rgba(184,115,51,0.15)]">
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                  </div>
                  <p className="text-zinc-300 text-base font-medium tracking-wide">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <p className="text-zinc-400 italic text-[15px] mb-6 leading-relaxed font-medium">
            "O BarberCenter mudou o nível do meu atendimento. Meus clientes adoram a facilidade de agendar pelo link, e meu faturamento ficou muito mais organizado."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D49A62] to-[#B87333] rounded-full flex items-center justify-center font-black text-[#050505] text-lg shadow-[0_5px_15px_rgba(184,115,51,0.25)]">
              M
            </div>
            <div>
              <p className="text-[#F7EFE2] font-black text-sm leading-none tracking-tight">Matheus Lopes</p>
              <p className="text-[#B87333] text-[10px] uppercase font-black mt-1.5 tracking-[0.2em]">Barbearia Elite</p>
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-[#050505] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,115,51,0.05),transparent_80%)] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo Mobile */}
          <div className="md:hidden flex justify-center mb-6">
             <span className="text-[2rem] font-black text-[#F7EFE2] tracking-tighter uppercase leading-none">
              Barber<span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Center</span>
            </span>
          </div>

          {/* Os benefícios do painel esquerdo são `hidden md:flex`, então no
              celular — de onde vem quase todo o tráfego de Instagram — a página
              era um formulário nu, sem um único motivo para preencher. */}
          <div className="md:hidden mb-6 space-y-3">
            <ReferralBanner variant="compact" />
            <ul className="grid grid-cols-2 gap-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#D49A62]" />
                  <span className="text-[11px] font-medium leading-snug text-zinc-400">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* No desktop a tarja fica acima do card, o painel já vende o resto. */}
          <div className="hidden md:block mb-5 empty:mb-0">
            <ReferralBanner variant="compact" />
          </div>

          <div className="bg-white/[0.02] p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] border border-white/5 backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="text-[1.75rem] font-black text-[#F7EFE2] tracking-tighter leading-tight">Crie sua conta grátis</h2>
              <p className="text-[#B87333]/80 text-[11px] font-black uppercase tracking-widest mt-2">Leva menos de 2 minutos.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {registerError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-[1.5rem] text-xs font-bold text-center">
                  {registerError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-[#B87333]/90 uppercase tracking-[0.2em] mb-2 ml-4">Seu Nome</label>
                <input 
                  {...trackedRegister('userName', { required: true })}
                  type="text" 
                  placeholder="Ex: João Emanuel"
                  className="w-full h-14 px-6 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 outline-none transition-all font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#B87333]/90 uppercase tracking-[0.2em] mb-2 ml-4">E-mail</label>
                <input 
                  {...trackedRegister('userEmail', { required: true })}
                  type="email" 
                  placeholder="seu@email.com"
                  className="w-full h-14 px-6 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 outline-none transition-all font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#B87333]/90 uppercase tracking-[0.2em] mb-2 ml-4">Nome da Barbearia</label>
                <input 
                  {...trackedRegister('barbershopName', { required: true })}
                  type="text" 
                  placeholder="Ex: Barber Center Matriz"
                  className="w-full h-14 px-6 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 outline-none transition-all font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#B87333]/90 uppercase tracking-[0.2em] mb-2 ml-4">Senha</label>
                <input 
                  {...trackedRegister('password', { required: true })}
                  type="password" 
                  placeholder="••••••••"
                  className="w-full h-14 px-6 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 outline-none transition-all font-medium shadow-inner"
                />
              </div>

              <motion.button
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-14 mt-8 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_10px_25px_rgba(184,115,51,0.25)] flex items-center justify-center gap-3 disabled:opacity-70 transition-all hover:brightness-110"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Começar meu teste
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-zinc-500 text-xs mt-8 font-medium">
              Já tem uma conta? <Link href="/login" className="text-[#D49A62] font-black tracking-wide hover:text-[#B87333] transition-colors">Fazer Login</Link>
            </p>
          </div>

          <p className="text-center text-[9px] text-zinc-600 mt-8 uppercase font-black tracking-[0.2em] px-8 leading-relaxed">
            Ao clicar em começar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </motion.div>
      </div>
    </div>
  );
}