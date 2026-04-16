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
      className="border-b border-zinc-800 py-4 group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center w-full text-left py-4 font-semibold text-zinc-300 group-hover:text-white transition-colors">
        <span className="text-lg md:text-xl tracking-tight">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown size={22} className={isOpen ? "text-orange-500" : "text-zinc-500"} />
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
  // Estado para controlar qual item está aberto (null = todos fechados)
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
    <section id="duvidas" className="py-24 px-6 bg-black overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Título com animação de entrada e parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
            Perguntas frequentes
          </h2>
          <div className="h-1 w-12 bg-orange-600 mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="space-y-2"
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