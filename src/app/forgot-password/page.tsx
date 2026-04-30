"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const whatsappNumber = "5538988654816";
    const message = encodeURIComponent("Olá! Esqueci minha senha no BarberCenter e gostaria de solicitar a redefinição.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm z-10 text-center"
            >
                <Link href="/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8">
                    <ArrowLeft size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Voltar ao Login</span>
                </Link>

                <div className="mb-10">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                        Recuperar <span className="text-orange-600">Acesso</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-4 font-medium">
                        Por questões de segurança, a troca de senha é feita manualmente pelo nosso suporte.
                    </p>
                </div>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(37,211,102,0.2)] transition-all flex items-center justify-center gap-3"
                >
                    <MessageCircle size={20} />
                    Chamar no WhatsApp
                </a>

                <p className="mt-8 text-zinc-600 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                    Atendimento de Segunda a Sábado <br /> em horário comercial.
                </p>
            </motion.div>
        </main>
    );
}