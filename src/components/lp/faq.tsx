import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="border-b border-zinc-800 py-6 group cursor-pointer">
      <div className="flex justify-between items-center w-full text-left font-semibold text-zinc-300 group-hover:text-white transition-colors">
        <span>{question}</span>
        <ChevronDown size={18} className="text-zinc-500 group-hover:text-orange-500 transition-all" />
      </div>
      <div className="mt-3 text-zinc-500 text-sm max-w-2xl leading-relaxed">
        {answer}
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="duvidas" className="py-24 px-6 bg-black">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Perguntas frequentes</h2>
        <div className="space-y-2">
          <FaqItem 
            question="Como funciona o período de teste do BarberCenter?" 
            answer="Você tem 45 dias para usar todas as funcionalidades sem pagar nada. Não pedimos cartão de crédito para começar o teste." 
          />
          <FaqItem 
            question="Posso acessar pelo celular e pelo computador?" 
            answer="Sim! O BarberCenter é 100% responsivo e você pode gerenciar sua barbearia de qualquer lugar através do navegador ou do app." 
          />
          <FaqItem 
            question="O sistema emite relatórios de comissão?" 
            answer="Com certeza. O sistema calcula a parte de cada barbeiro automaticamente com base nos serviços realizados." 
          />
          <FaqItem 
            question="Meus dados estão seguros?" 
            answer="Sim, utilizamos criptografia SSL e servidores de alta segurança para garantir que os dados dos seus clientes e finanças estejam protegidos." 
          />
        </div>
      </div>
    </section>
  );
}