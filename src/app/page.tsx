"use client";

import { useState, useEffect, useRef } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";
import { ServiceSelector } from "@/components/ServiceSelector";

export default function BarberChat() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({ name: "", service: "", date: "", time: "" });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step]);

  const handleName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userData.name) setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary flex items-center justify-center p-0 md:p-6">
      <main className="w-full max-w-5xl bg-surface/30 md:glass flex flex-col md:flex-row md:rounded-[32px] overflow-hidden shadow-2xl border-none md:border md:border-white/5 transition-all md:h-[750px]">

        {/* Lado Esquerdo: O Chatbot Ativo */}
        <aside className="w-full md:w-[450px] flex flex-col bg-black/40 shrink-0 border-b md:border-b-0 md:border-r border-white/5">
          <header className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-gradient border border-white/10" />
              <h1 className="font-bold text-base">InBarber Assistant</h1>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar scroll-smooth">
            {/* PERGUNTA 1: NOME */}
            <ChatBubble isAi text="Olá! Bem-vindo à InBarber. Para começarmos seu agendamento, qual é o seu nome?" />

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <input
                  autoFocus
                  type="text"
                  placeholder="Digite seu nome e aperte Enter..."
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-white/30 transition-all"
                  onKeyDown={handleName}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>
            )}

            {/* PERGUNTA 2: SERVIÇO */}
            {step >= 2 && (
              <>
                <ChatBubble text={userData.name} />
                <ChatBubble isAi text={`Prazer em te conhecer, ${userData.name.split(' ')[0]}! Qual serviço você deseja realizar hoje?`} />

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <ServiceSelector onSelect={(s) => { setUserData({ ...userData, service: s }); setStep(3); }} />
                  </div>
                )}
              </>
            )}

            {/* PERGUNTA 3: HORÁRIO */}
            {step >= 3 && (
              <>
                <ChatBubble text={userData.service} />
                <ChatBubble isAi text="Ótima escolha! Agora, qual o melhor dia e horário para você?" />

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
                    <DateSelector />
                    <TimeGrid />
                    <button
                      onClick={() => setStep(4)}
                      className="w-full bg-white text-black py-4 rounded-xl font-bold active:scale-95 transition-all shadow-lg"
                    >
                      Confirmar Horário
                    </button>
                  </div>
                )}
              </>
            )}

            {/* FINALIZAÇÃO */}
            {step === 4 && (
              <>
                <ChatBubble text="Horário selecionado!" />
                <ChatBubble isAi text={`Tudo pronto, ${userData.name.split(' ')[0]}! Seu agendamento para ${userData.service} foi realizado com sucesso. Te esperamos lá! ✂️`} />
              </>
            )}
          </div>
        </aside>

        {/* Lado Direito: Visual de Destaque (Desktop Only) */}
        <section className="hidden md:flex flex-1 flex-col items-center justify-center p-12 bg-background/20 relative overflow-hidden">
          {/* Elemento Decorativo: Um preview do que está acontecendo */}
          <div className="text-center space-y-6 z-10">
            <div className="w-24 h-24 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-8 rotate-3 shadow-2xl">
              <span className="text-4xl">🗓️</span>
            </div>
            <h2 className="text-4xl font-black opacity-20 uppercase tracking-[0.3em]">Agendamento</h2>
            <div className="space-y-2 opacity-40 italic">
              <p>{userData.name || "Aguardando nome..."}</p>
              <p>{userData.service || "---"}</p>
              <p>{userData.time || "---"}</p>
            </div>
          </div>
          {/* Background Blur Decorativo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[120px]" />
        </section>
      </main>
    </div>
  );
}