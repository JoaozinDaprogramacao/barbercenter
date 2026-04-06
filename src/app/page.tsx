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

  return (
    <main className="absolute inset-0 flex flex-col bg-[#050505] max-w-2xl mx-auto overflow-hidden">
      <header className="p-4 border-b border-white/5 bg-[#0A0A0A] flex items-center gap-3 shrink-0 z-20">
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
        <div>
          <h1 className="font-bold text-[16px] text-white leading-none">InBarber</h1>
          <p className="text-[11px] text-green-500 font-bold uppercase tracking-widest mt-1 leading-none">
            Online
          </p>
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
              {/* Dentro do step >= 3 */}
              <div className="space-y-6 pt-2">
                <DateSelector
                  value={userData.date}
                  onChange={(date) => setUserData(prev => ({ ...prev, date }))}
                />
                <TimeGrid
                  value={userData.time}
                  onChange={(time) => setUserData(prev => ({ ...prev, time }))}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <ChatBubble isAi text="Tudo pronto! Seu agendamento foi realizado. ✂️" />
          )}
        </div>
      </div>

      <footer className="p-4 bg-[#0A0A0A] border-t border-white/5 shrink-0 z-20 pb-safe">
        {step === 1 && (
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              autoComplete="off"
              enterKeyHint="done"
              placeholder="Digite seu nome..."
              onFocus={handleFocus}
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-[16px] text-white outline-none focus:bg-white/10"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={handleNextClick}
              onTouchEnd={handleNextTouchEnd}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goToNextStepWithName();
                }
              }}
              className="bg-white text-black px-6 rounded-xl font-bold text-[16px] active:scale-95 transition-transform flex items-center justify-center select-none"
              style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            >
              Enviar
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <ServiceSelector
              onSelect={(service) => {
                setUserData((prev) => ({ ...prev, service }));
                setStep(3);
              }}
            />
          </div>
        )}

        {step === 3 && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setStep(4)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setStep(4);
            }}
            className="w-full bg-white text-black py-5 rounded-xl font-black text-[16px] uppercase tracking-widest active:scale-95 transition-all shadow-xl text-center select-none"
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
          >
            Confirmar Agendamento
          </div>
        )}
      </footer>
    </main>
  );
}