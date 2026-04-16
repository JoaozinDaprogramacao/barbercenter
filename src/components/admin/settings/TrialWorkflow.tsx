"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Rocket, Copy, Check, ChevronLeft, X } from 'lucide-react';
import Image from 'next/image';

interface TrialWorkflowProps {
    forcedOpen?: boolean;
    onClose?: () => void;
}

export function TrialWorkflow({ forcedOpen = false, onClose }: TrialWorkflowProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [copied, setCopied] = useState(false);

    const pixCode = "00020101021226910014br.gov.bcb.pix2569ap";

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Alerta Discreto na Lista de Configurações */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mb-6 p-4 rounded-[2rem] bg-orange-600/10 border border-orange-600/20 flex items-center justify-between group hover:bg-orange-600/20 transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-orange-600 p-2.5 rounded-xl text-white shadow-lg shadow-orange-600/20">
                        <Clock size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-white text-sm font-black uppercase tracking-tight">Período de Teste Ativo</p>
                        <p className="text-orange-500/80 text-xs font-bold">Restam 42 dias • Clique para assinar</p>
                    </div>
                </div>
                <ChevronLeft size={20} className="text-orange-500 rotate-180" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center"
                    >
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="bg-zinc-950 w-full max-w-md h-[90vh] sm:h-auto sm:rounded-[3rem] border-t sm:border border-zinc-900 overflow-hidden relative"
                        >
                            {/* Header do Modal */}
                            <div className="p-6 flex justify-between items-center border-b border-zinc-900">
                                {step > 1 && (
                                    <button onClick={() => setStep(step - 1)} className="text-zinc-500 hover:text-white">
                                        <ChevronLeft size={24} />
                                    </button>
                                )}
                                <div className="flex-1 text-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Assinatura</span>
                                </div>
                                <button onClick={() => { setIsOpen(false); setStep(1); }} className="text-zinc-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto max-h-[70vh]">
                                {/* STEP 1: RESUMO DO PLANO */}
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
                                        <h2 className="text-2xl font-black text-white leading-tight mb-8">Este é seu plano de assinatura atual</h2>

                                        <div className="relative w-48 h-48 mx-auto mb-6">
                                            <Image src="/rocket.png" alt="Foguete" fill className="object-contain animate-pulse" />
                                        </div>

                                        <div className="mb-8">
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Apenas</p>
                                            <h3 className="text-4xl font-black text-white italic">R$ 32,90<span className="text-lg text-zinc-500 font-bold not-italic">/mês</span></h3>
                                            <p className="text-zinc-500 text-sm font-medium mt-2">por profissional</p>
                                            <div className="mt-4 inline-block bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                                                <p className="text-white font-bold text-sm tracking-tight">Total R$ 32,90/ mês</p>
                                            </div>
                                        </div>

                                        <p className="text-zinc-500 text-xs leading-relaxed font-medium mb-10">
                                            A assinatura fortalece nossa parceria, nos permitindo evoluir a ferramenta desenvolvendo novas funcionalidades.
                                        </p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="bg-[#00A382] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                                            >
                                                PIX
                                            </button>
                                            <button
                                                onClick={() => setStep(3)}
                                                className="bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all"
                                            >
                                                CARTÃO
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: PAGAMENTO PIX */}
                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
                                        <h2 className="text-2xl font-black text-white mb-8 tracking-tight">PIX para pagamento</h2>

                                        <div className="bg-white p-4 rounded-3xl inline-block mb-8">
                                            <Image src="/qr-code-placeholder.png" width={200} height={200} alt="QR Code" />
                                        </div>

                                        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 mb-6 truncate text-zinc-400 text-xs font-mono">
                                            {pixCode}
                                        </div>

                                        <button
                                            onClick={handleCopyPix}
                                            className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest mb-10 flex items-center justify-center gap-3"
                                        >
                                            {copied ? <Check size={20} /> : <Copy size={20} />}
                                            {copied ? "CÓDIGO COPIADO" : "COPIAR CÓDIGO PIX"}
                                        </button>

                                        <div className="space-y-4 text-left">
                                            {[
                                                { num: "1", text: "Copie o código Pix de pagamento" },
                                                { num: "2", text: "Use o código Pix para pagar pelo aplicativo do seu banco" },
                                                { num: "3", text: "Aguarde, sua assinatura será confirmada logo após o pagamento." }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-900">
                                                    <span className="text-orange-600 font-black">{item.num} -</span>
                                                    <p className="text-zinc-400 text-xs font-bold leading-relaxed">{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: CARTÃO (Opcional/Placeholder) */}
                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-20">
                                        <Rocket size={48} className="mx-auto text-orange-600 mb-6" />
                                        <h2 className="text-xl font-black text-white">Integração em andamento</h2>
                                        <p className="text-zinc-500 text-sm mt-2">O pagamento via cartão estará disponível em breve. Use o PIX para ativação imediata.</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}