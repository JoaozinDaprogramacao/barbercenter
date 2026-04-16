'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRegister } from '@/hooks/use-register';

export default function RegisterPage() {
  const { register: registerUser, isLoading, error: registerError } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const benefits = [
    "45 dias totalmente grátis",
    "Não precisa de cartão de crédito",
    "Acesso total a todas as ferramentas",
    "Suporte humanizado via WhatsApp"
  ];

  const onSubmit = (data: any) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 lg:p-24 flex-col justify-between relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600/20 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <img src="/logo-white.png" alt="Logo" className="h-12 w-auto object-contain" />
            <span className="text-xl font-black text-white tracking-tighter uppercase">
              Barber<span className="text-orange-600">Center</span>
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-8">
              Comece a transformar sua barbearia <span className="text-orange-600">hoje mesmo.</span>
            </h1>

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-orange-600/20 p-1 rounded-full text-orange-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-slate-300 text-lg font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
          <p className="text-white/80 italic text-lg mb-4">
            "O BarberCenter mudou o nível do meu atendimento. Meus clientes adoram a facilidade de agendar pelo link."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white text-sm">M</div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Matheus Lopes</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-widest">Barbearia Elite</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="md:hidden flex justify-center mb-8">
             <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              Barber<span className="text-orange-600">Center</span>
            </span>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Crie sua conta grátis</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">Leva menos de 2 minutos.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                  {registerError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Seu Nome</label>
                <input 
                  {...register('userName', { required: true })}
                  type="text" 
                  placeholder="Ex: João Emanuel"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                <input 
                  {...register('userEmail', { required: true })}
                  type="email" 
                  placeholder="seu@email.com"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome da Barbearia</label>
                <input 
                  {...register('barbershopName', { required: true })}
                  type="text" 
                  placeholder="Ex: Barber Center Matriz"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
                <input 
                  {...register('password', { required: true })}
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <motion.button
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-200 flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Começar meu teste
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-slate-400 text-xs mt-8 font-medium">
              Já tem uma conta? <Link href="/login" className="text-orange-600 font-bold hover:underline">Fazer Login</Link>
            </p>
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-8 uppercase font-bold tracking-[0.2em] px-8">
            Ao clicar em começar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </motion.div>
      </div>
    </div>
  );
}