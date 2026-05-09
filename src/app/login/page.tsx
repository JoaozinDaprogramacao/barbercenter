"use client";

import { useLogin } from "@/hooks/useLogin"; 
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        errorMsg,
        handleLogin
    } = useLogin();

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] px-6 font-sans relative overflow-hidden">
            
            {/* Efeitos de Fundo Premium (Glows em tons de Cobre/Dourado) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(184,115,51,0.15),transparent_60%)]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(212,154,98,0.10),transparent_60%)]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm z-10 will-change-transform"
            >
                <div className="text-center mb-10">
                    {/* Logo (se tiver versão clara/dourada é ideal, senão a original serve) */}
                    <img 
                        src="/logo.png" 
                        alt="Logo BarberCenter" 
                        className="h-32 w-auto object-contain mx-auto mb-6 drop-shadow-[0_10px_20px_rgba(184,115,51,0.15)]"
                    />
                    <h1 className="text-[2rem] font-black text-[#F7EFE2] uppercase tracking-tighter leading-none">
                        Barber<span className="bg-gradient-to-r from-[#D49A62] to-[#B87333] bg-clip-text text-transparent">Center</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-3 font-medium">Acesse sua agenda e faturamento</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 backdrop-blur-md p-8 rounded-[2.5rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {errorMsg && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-[1.5rem] text-center font-bold tracking-wide will-change-transform"
                            >
                                {errorMsg}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B87333]/90 ml-4">
                                E-mail
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="seu@email.com"
                                className="w-full h-14 px-6 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 focus:outline-none transition-all shadow-inner"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B87333]/90">
                                    Senha
                                </label>
                                
                                <Link 
                                    href="/forgot-password" 
                                    className="text-[10px] font-bold text-zinc-500 hover:text-[#D49A62] transition-colors uppercase tracking-widest"
                                >
                                    Esqueceu?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full h-14 px-6 rounded-[1.5rem] bg-[#0A0A0A] border border-white/10 text-[#F7EFE2] placeholder:text-zinc-600 focus:border-[#B87333]/50 focus:ring-1 focus:ring-[#B87333]/50 focus:outline-none transition-all shadow-inner"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 mt-4 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] font-black uppercase tracking-widest text-xs rounded-[1.5rem] shadow-[0_10px_25px_rgba(184,115,51,0.25)] transition-all disabled:opacity-60 flex items-center justify-center will-change-transform hover:brightness-110"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                            ) : (
                                "Entrar no Sistema"
                            )}
                        </motion.button>
                    </form>
                </div>

                <p className="text-center mt-10 text-zinc-500 text-xs font-medium">
                    Ainda não tem acesso?{" "}
                    <a
                        href="https://wa.me/5538988654816"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D49A62] cursor-pointer hover:text-[#B87333] transition-colors font-bold tracking-wide"
                    >
                        Falar com suporte
                    </a>
                </p>
            </motion.div>
        </main>
    );
}