"use client";

import { useLogin } from "@/hooks/useLogin"; 
import { motion } from "framer-motion";

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
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm z-10 will-change-transform"
            >
                <div className="text-center mb-10">
                    <img 
                        src="/logo-white.png" 
                        alt="Logo BarberCenter" 
                        className="h-32 w-auto object-contain mx-auto mb-6"
                    />
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                        Barber<span className="text-orange-600">Center</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-medium">Acesse sua agenda e faturamento</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {errorMsg && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl text-center font-medium will-change-transform"
                        >
                            {errorMsg}
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-orange-500 ml-4">E-mail</label>
                        <input
                            type="email"
                            required
                            placeholder="seu@email.com"
                            className="w-full h-14 px-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 focus:outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-orange-500">Senha</label>
                            <button type="button" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-tighter">Esqueceu?</button>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full h-14 px-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 focus:outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 mt-6 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.2)] transition-all disabled:opacity-50 flex items-center justify-center will-change-transform"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Entrar no Sistema"
                        )}
                    </motion.button>
                </form>

                <p className="text-center mt-10 text-zinc-500 text-xs font-medium">
                    Ainda não tem acesso?{" "}
                    <a
                        href="https://wa.me/5538988654816"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 cursor-pointer hover:text-orange-400 transition-colors font-bold"
                    >
                        Falar com suporte
                    </a>
                </p>
            </motion.div>
        </main>
    );
}