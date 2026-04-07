"use client";

// Importe o Hook que acabamos de criar (Ajuste o caminho se a sua pasta hooks estiver em outro lugar)
import { useLogin } from "@/hooks/useLogin"; 

export default function LoginPage() {
    // Trazendo toda a lógica e estados de dentro do nosso hook
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
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6 font-sans relative">
            {/* Background Decorativo (Opcional) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-sm z-10">
                {/* Logo e Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-surface border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B27B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18" /><path d="M4 21V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11" /><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /><path d="M10 2H14" /><path d="M12 2v6" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Barber Admin</h1>
                    <p className="text-text-secondary text-sm mt-2 font-medium">Acesse sua agenda e faturamento</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleLogin} className="space-y-4">
                    
                    {/* Alerta de Erro - Só aparece se errorMsg tiver algum texto */}
                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl text-center font-medium animate-in fade-in zoom-in duration-300">
                            {errorMsg}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-accent ml-4">E-mail</label>
                        <input
                            type="email"
                            required
                            placeholder="seu@email.com"
                            className="w-full h-14 px-6 rounded-2xl bg-surface border border-white/5 text-white placeholder:text-white/20 focus:border-accent/50 focus:outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-accent">Senha</label>
                            <button type="button" className="text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-tighter">Esqueceu?</button>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full h-14 px-6 rounded-2xl bg-surface border border-white/5 text-white placeholder:text-white/20 focus:border-accent/50 focus:outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 mt-6 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(178,123,92,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            "Entrar no Sistema"
                        )}
                    </button>
                </form>

                {/* Footer Login */}
                <p className="text-center mt-10 text-white/20 text-xs font-medium">
                    Ainda não tem acesso?{" "}
                    <a
                        href="https://wa.me/5538988654816"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent cursor-pointer hover:underline transition-all font-bold"
                    >
                        Falar com suporte
                    </a>
                </p>
            </div>
        </main>
    );
}