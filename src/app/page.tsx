"use client";

import { useState, useEffect, useRef } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";
import { ServiceSelector } from "@/components/ServiceSelector";

export default function BarberChat() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({ name: "", service: "", date: "", time: "" });
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step, userData]);

  const handleSendName = () => {
    if (inputValue.trim().length > 1) {
      setUserData({ ...userData, name: inputValue });
      setStep(2);
      setInputValue("");
    }
  };

  // A MÁGICA ANTI-PULO DO iPHONE
  const handleFocus = () => {
    // Força o navegador a abortar qualquer tentativa de scroll na página principal
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50); // Double check para o tempo da animação do teclado
  };

  return (
    // position absolute e inset-0 prendem o container nos 4 cantos da tela nativamente
    <main className="absolute inset-0 flex flex-col bg-[#050505] max-w-2xl mx-auto overflow-hidden">
      
      {/* HEADER FIXO */}
      <header className="p-4 border-b border-white/5 bg-[#0A0A0A] flex items-center gap-3 shrink-0 z-20">
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
        <div>
          <h1 className="font-bold text-[16px] text-white leading-none">InBarber</h1>
          <p className="text-[11px] text-green-500 font-bold uppercase tracking-widest mt-1 leading-none">Online</p>
        </div>
      </header>

      {/* ÁREA DE MENSAGENS (Aqui o scroll interno flui normalmente) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar flex flex-col z-10">
        <div className="mt-auto space-y-6 pb-2">
          
          <ChatBubble isAi isBig text="Olá! Bem-vindo. Qual o seu nome?" />
          
          {step >= 2 && (
            <>
              <ChatBubble text={userData.name} />
              <ChatBubble isAi isBig text={`Prazer, ${userData.name.split(' ')[0]}! Qual serviço vamos fazer hoje?`} />
            </>
          )}

          {step >= 3 && (
            <>
              <ChatBubble text={userData.service} />
              <ChatBubble isAi isBig text="Ótimo. Escolha o dia e o horário:" />
              <div className="space-y-6 pt-2">
                <DateSelector />
                <TimeGrid />
              </div>
            </>
          )}

          {step === 4 && (
            <ChatBubble isAi text="Tudo pronto! Seu agendamento foi realizado. ✂️" />
          )}

        </div>
      </div>

      {/* FOOTER FIXO (Preso no rodapé, sobe limpo junto com o teclado) */}
      <footer className="p-4 bg-[#0A0A0A] border-t border-white/5 shrink-0 z-20 pb-safe">
        {step === 1 && (
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Digite seu nome..."
              // onFocus com a trava aplicada
              onFocus={handleFocus}
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-[16px] text-white outline-none focus:bg-white/10"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendName()}
            />
            <button 
              onClick={handleSendName}
              className="bg-white text-black px-6 rounded-xl font-bold text-[16px] active:scale-95 transition-transform"
            >
              Enviar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <ServiceSelector onSelect={(s) => { setUserData({...userData, service: s}); setStep(3); }} />
          </div>
        )}

        {step === 3 && (
          <button 
            onClick={() => setStep(4)}
            className="w-full bg-white text-black py-5 rounded-xl font-black text-[16px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
          >
            Confirmar Agendamento
          </button>
        )}
      </footer>
      
    </main>
  );
}