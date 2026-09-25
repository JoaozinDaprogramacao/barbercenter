"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button, Field, inputClass } from "@/components/console/ui";

export default function ConsoleLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await signIn("platform", { email, password, redirect: false });

        if (result?.error) {
            // Mensagem única, igual à do servidor: a tela não conta se o e-mail
            // existe, se a senha errou ou se a conta está trancada.
            setError("Credenciais inválidas.");
            setIsLoading(false);
            return;
        }

        router.push("/console");
        router.refresh();
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B27B5C]/15 text-[#D49A62]">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-white">Console BarberCenter</h1>
                    <p className="mt-1 text-sm text-[#8E8E93]">Acesso restrito à equipe da plataforma.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/5 bg-[#101012] p-6">
                    <Field label="E-mail">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Senha">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className={inputClass}
                        />
                    </Field>

                    {error && (
                        <p className="rounded-xl border border-[#F87171]/30 bg-[#F87171]/10 px-3 py-2 text-xs text-[#F87171]">
                            {error}
                        </p>
                    )}

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 size={14} className="animate-spin" />
                                Entrando
                            </span>
                        ) : (
                            "Entrar"
                        )}
                    </Button>
                </form>

                <p className="mt-6 text-center text-[10px] uppercase tracking-[0.15em] text-[#5A5A5F]">
                    Tentativas são registradas
                </p>
            </div>
        </main>
    );
}
