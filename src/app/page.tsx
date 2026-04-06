"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";
import { ServiceSelector } from "@/components/ServiceSelector";

export default function BarberChat() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
  });
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const actionLockRef = useRef(false);

  const handleGoBack = () => {
    if (step === 3) {
      if (userData.date) {
        // Se já escolheu a data (está vendo os horários), o "voltar" apenas limpa a data/hora
        setUserData((prev) => ({ ...prev, date: "", time: "" }));
      } else {
        // Se não tem data escolhida, volta para o passo 2 (Serviços) e limpa o serviço
        setUserData((prev) => ({ ...prev, service: "" }));
        setStep(2);
      }
    } else if (step === 2) {
      // Se está no passo 2, volta para o passo 1 (Nome)
      setStep(1);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step, userData]);

  const goToNextStepWithName = useCallback(() => {
    if (actionLockRef.current) return;

    const name = inputValue.trim();
    if (name.length < 2) return;

    actionLockRef.current = true;

    setUserData((prev) => ({
      ...prev,
      name,
    }));

    setStep(2);
    setInputValue("");

    if (inputRef.current) {
      inputRef.current.blur();
    }

    setTimeout(() => {
      actionLockRef.current = false;
    }, 300);
  }, [inputValue]);

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      goToNextStepWithName();
    }
  };

  const handleNextTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    goToNextStepWithName();
  };

  const handleNextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    goToNextStepWithName();
  };

  const handleFocus = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  };

  useEffect(() => {
    if (userData.date && scrollRef.current) {
      // Pequeno delay para a animação do TimeGrid começar
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    }
  }, [userData.date]);

  return (
    <main className="absolute inset-0 flex flex-col bg-[#050505] max-w-2xl mx-auto overflow-hidden">
      <header className="p-4 border-b border-white/5 bg-[#0A0A0A] flex items-center gap-3 shrink-0 z-20">
        {/* Ícone proprietário arredondado (estilo App) */}
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
          {/* SVG minimalista simulando lâminas cruzadas/precisão */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
            <path d="M19 19L5 5" strokeDasharray="4 4" />
            <path d="M5 19L19 5" />
          </svg>
        </div>

        <div>
          <h1 className="font-bold text-[16px] text-white tracking-wide">InBarber</h1>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5 leading-none">Agendamento Rápido</p>
        </div>
      </header>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar flex flex-col z-10"
      >
        <div className="mt-auto space-y-6 pb-2">
          <ChatBubble isAi isBig text="Olá! Bem-vindo. Qual o seu nome?" />

          {step >= 2 && (
            <>
              <ChatBubble text={userData.name} />
              <ChatBubble
                isAi
                isBig
                text={`Prazer, ${userData.name.split(" ")[0]}! Qual serviço vamos fazer hoje?`}
              />
            </>
          )}

          {step >= 3 && (
            <>
              {/* Resposta do usuário para o Serviço */}
              <ChatBubble text={userData.service} />

              {/* Pergunta da IA para a Data */}
              <ChatBubble isAi isBig text="Qual dia fica melhor para você?" />

              <div className="space-y-6 pt-2">
                <DateSelector
                  value={userData.date}
                  onChange={(date) => {
                    setUserData(prev => ({ ...prev, date }));
                  }}
                />

                {/* OS HORÁRIOS SÓ APARECEM SE TIVER UMA DATA SELECIONADA */}
                {userData.date && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ChatBubble isAi isBig text={`Perfeito! Quais destes horários para ${userData.date.replace('-', ' de ')}?`} />

                    <TimeGrid
                      value={userData.time}
                      onChange={(time) => setUserData(prev => ({ ...prev, time }))}
                    />

                    {/* 👇 O BOTÃO QUE FICAVA AQUI FOI REMOVIDO! 👇 */}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="text-2xl font-black text-white text-center mb-2">
                Agendamento Confirmado!
              </h2>
              <p className="text-zinc-400 text-center max-w-[250px] text-sm mb-8">
                Tudo certo, <strong>{userData.name.split(" ")[0]}</strong>! Te esperamos dia {userData.date.split('-')[0]} às {userData.time}.
              </p>

              <button
                onClick={() => window.location.reload()} // Ou resetar os estados
                className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Realizar novo agendamento
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="p-4 bg-[#0A0A0A] border-t border-white/5 shrink-0 z-20 pb-safe">

        {/* PASSO 1: APENAS INPUT E ENVIAR */}
        {step === 1 && (
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Digite seu nome..."
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <button
              onClick={goToNextStepWithName}
              className="bg-white text-black px-6 rounded-xl font-bold active:scale-95 transition-all"
            >
              Enviar
            </button>
          </div>
        )}

        {/* PASSOS 2 E 3: NAVEGAÇÃO DUPLA (VOLTAR / PRÓXIMO) */}
        {(step === 2 || step === 3) && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3">

            {/* Se estiver no Step 2, renderiza o seletor de serviço em cima dos botões */}
            {step === 2 && (
              <ServiceSelector
                onSelect={(service) => {
                  setUserData((prev) => ({ ...prev, service }));
                  setStep(3);
                }}
              />
            )}

            {/* OS BOTÕES DE CONTROLE ABAIXO DE TUDO */}
            <div className="flex gap-3">
              {/* BOTÃO VOLTAR/CORRIGIR */}
              <button
                onClick={handleGoBack}
                className="flex-1 bg-zinc-900 text-zinc-400 py-4 rounded-xl font-bold border border-white/5 active:scale-95 transition-all"
              >
                Corrigir anterior
              </button>

              {/* BOTÃO AVANÇAR/CONFIRMAR */}
              {step === 3 && (
                <button
                  disabled={!userData.date || !userData.time}
                  onClick={() => setStep(4)}
                  className={`flex-[2] py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl
              ${(!userData.date || !userData.time)
                      ? 'bg-zinc-800 text-zinc-600 opacity-50'
                      : 'bg-white text-black active:scale-95'}`}
                >
                  Confirmar
                </button>
              )}
            </div>
          </div>
        )}

        {/* PASSO 4: FINALIZADO (Botão para reiniciar ou fechar) */}
        {step === 4 && (
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white/5 text-white/50 rounded-xl text-sm font-bold"
          >
            Novo Agendamento
          </button>
        )}
      </footer>
    </main>
  );
}