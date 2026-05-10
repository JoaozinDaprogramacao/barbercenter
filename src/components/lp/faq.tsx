'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps) {
  return (
    <div 
      className="border-b border-white/5 py-4 group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center w-full text-left py-4 font-semibold text-zinc-400 group-hover:text-[#F7EFE2] transition-colors">
        <span className="text-lg md:text-xl tracking-tight">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown size={22} className={isOpen ? "text-[#D49A62]" : "text-zinc-600"} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-zinc-500 text-base max-w-2xl leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      question: "Como funciona o período de teste do BarberCenter?",
      answer: "Você tem 45 dias para usar todas as funcionalidades sem pagar nada. Não pedimos cartão de crédito para começar o teste."
    },
    {
      question: "Posso acessar pelo celular e pelo computador?",
      answer: "Sim! O BarberCenter é 100% responsivo e você pode gerenciar sua barbearia de qualquer lugar através do navegador ou do app."
    },
    {
      question: "O sistema emite relatórios de comissão?",
      answer: "Com certeza. O sistema calcula a parte de cada barbeiro automaticamente com base nos serviços realizados."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim, utilizamos criptografia SSL e servidores de alta segurança para garantir que os dados dos seus clientes e finanças estejam protegidos."
    }
  ];

  return (
    <section id="duvidas" className="py-24 px-6 bg-[#050505] overflow-hidden relative">
      {/* Background Glow Premium */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-[#F7EFE2] tracking-tighter">
            Perguntas frequentes
          </h2>
          <div className="h-1 w-12 bg-gradient-to-r from-[#D49A62] to-[#B87333] mx-auto mt-6 rounded-full" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="space-y-2 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-md"
        >
          {questions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <FaqItem 
                question={item.question} 
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}