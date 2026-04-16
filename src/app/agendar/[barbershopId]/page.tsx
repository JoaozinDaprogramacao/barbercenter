"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBubble } from "@/components/ChatBubble";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";
import { ServiceSelector } from "@/components/ServiceSelector";
import { Send, CheckCircle2, Sparkles, ChevronLeft } from "lucide-react";

export default function BarberChat() {
  const params = useParams();
  const barbershopId = params.barbershopId as string;

  const [shopName, setShopName] = useState("Carregando...");
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [userData, setUserData] = useState({
    name: "",
    serviceId: "",
    serviceName: "",
    date: "",
    time: "",
  });
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const actionLockRef = useRef(false);
  const [businessHours, setBusinessHours] = useState<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, userData.date, userData.time]);

  useEffect(() => {
    if (!barbershopId) return;
    fetch(`/api/public/barbershop/${barbershopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          setShopName(data.name);
          setAvailableServices(data.services || []);
          setBusinessHours(data.businessHours);
        }
      });
  }, [barbershopId]);

  const goToNextStepWithName = useCallback(() => {
    if (actionLockRef.current) return;
    const name = inputValue.trim();
    if (name.length < 2) return;
    actionLockRef.current = true;
    setUserData((prev) => ({ ...prev, name }));
    setStep(2);
    setInputValue("");
    if (inputRef.current) inputRef.current.blur();
    setTimeout(() => { actionLockRef.current = false; }, 300);
  }, [inputValue]);

  const handleGoBack = () => {
    if (step === 3) {
      if (userData.date) setUserData((prev) => ({ ...prev, date: "", time: "" }));
      else { setUserData((prev) => ({ ...prev, serviceId: "", serviceName: "" })); setStep(2); }
    } else if (step === 2) setStep(1);
  };

  const handleConfirmAppointment = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/public/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: userData.name,
          serviceId: userData.serviceId,
          date: userData.date,
          time: userData.time,
          barbershopId: barbershopId
        })
      });
      setStep(4);
    } catch (error) { alert("Erro ao agendar."); }
    finally { setIsSubmitting(false); }
  };

  const getAvailableTimesForDate = (selectedDate: string) => {
    if (!businessHours || !selectedDate) return [];
    const monthMap: any = { "jan": 0, "fev": 1, "mar": 2, "abr": 3, "mai": 4, "jun": 5, "jul": 6, "ago": 7, "set": 8, "out": 9, "nov": 10, "dez": 11 };
    const parts = selectedDate.split("-");
    const dateObj = new Date(new Date().getFullYear(), monthMap[parts[1].toLowerCase()], parseInt(parts[0], 10));
    const dayConfig = businessHours[dateObj.getDay()];
    if (!dayConfig || !dayConfig.isOpen) return [];
    const slots = [];
    let [h, m] = dayConfig.openTime.split(":").map(Number);
    const [eh, em] = dayConfig.closeTime.split(":").map(Number);
    let current = h * 60 + m;
    const end = eh * 60 + em;
    while (current < end) {
      slots.push(`${Math.floor(current / 60).toString().padStart(2, "0")}:${(current % 60).toString().padStart(2, "0")}`);
      current += 30;
    }
    return slots;
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-black max-w-md mx-auto border-x border-zinc-900">

      {/* HEADER */}
      <header className="px-6 py-6 border-b border-zinc-900 bg-black/50 backdrop-blur-xl flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
            <Sparkles size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-sm text-white uppercase tracking-wider leading-none">{shopName}</h1>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Agendamento Online</p>
          </div>
        </div>
      </header>

      {/* CHAT AREA - Ocupa todo o espaço e permite scroll */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="space-y-8 pb-10">
          <AnimatePresence mode="popLayout">
            {/* Mensagem Inicial */}
            <ChatBubble
              key="welcome-msg"
              isAi
              text={`Olá! Bem-vindo(a) à ${shopName}. Como podemos te chamar?`}
            />

            {/* Passo 2: Nome e Pergunta de Serviço */}
            {step >= 2 && (
              <div key="step-2-container" className="space-y-8">
                <ChatBubble key="user-name-msg" text={userData.name} isUser />
                <ChatBubble
                  key="ai-ask-service-msg"
                  isAi
                  text={`Prazer, ${userData.name.split(" ")[0]}! Qual serviço vamos fazer hoje?`}
                />
              </div>
            )}

            {/* Passo 3: Escolha de Data e Horário */}
            {step >= 3 && (
              <div key="step-3-container" className="space-y-8">
                <ChatBubble key="user-service-msg" text={userData.serviceName} isUser />
                <ChatBubble key="ai-ask-date-msg" isAi text="Qual dia fica melhor para você?" />

                <motion.div
                  key="date-selector-wrapper"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <DateSelector
                    value={userData.date}
                    onChange={(date) => setUserData(prev => ({ ...prev, date }))}
                  />
                </motion.div>

                {userData.date && (
                  <div key="time-section" className="space-y-6 pt-4">
                    <ChatBubble
                      key="ai-ask-time-msg"
                      isAi
                      text={`Perfeito! Escolha um horário para ${userData.date.replace('-', ' de ')}:`}
                    />
                    <motion.div
                      key="time-grid-wrapper"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <TimeGrid
                        value={userData.time}
                        availableTimes={getAvailableTimesForDate(userData.date)}
                        onChange={(time) => setUserData(prev => ({ ...prev, time }))}
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {/* Passo 4: Tela de Sucesso */}
            {step === 4 && (
              <motion.div
                key="success-step"
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-green-500/20">
                  <CheckCircle2 size={40} className="text-green-500" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Confirmado!</h2>
                <p className="text-zinc-500 text-sm mb-8">
                  Te esperamos dia {userData.date.split('-')[0]} às {userData.time}.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-[10px] font-black uppercase text-zinc-500 tracking-widest hover:text-white transition-colors"
                >
                  Novo Agendamento
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER - SEMPRE NO FUNDO DA TELA */}
      <footer className="p-6 bg-zinc-950 border-t border-zinc-900 shrink-0 z-30 pb-safe">
        {step === 1 && (
          <div className="flex gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-[2rem]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Escreva seu nome..."
              className="flex-1 bg-transparent px-4 py-2 text-white outline-none text-sm font-medium"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToNextStepWithName()}
            />
            <button
              onClick={goToNextStepWithName}
              className="w-11 h-11 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
              <Send size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {(step === 2 || step === 3) && (
          <div className="flex flex-col gap-4">
            {step === 2 && (
              <ServiceSelector
                services={availableServices}
                onSelect={(id, name) => {
                  setUserData(prev => ({ ...prev, serviceId: id, serviceName: name }));
                  setStep(3);
                }}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={handleGoBack}
                className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 active:scale-95 transition-all"
              >
                <ChevronLeft size={24} />
              </button>

              {step === 3 && (
                <button
                  disabled={!userData.date || !userData.time || isSubmitting}
                  onClick={handleConfirmAppointment}
                  className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all
              ${(!userData.date || !userData.time || isSubmitting)
                      ? 'bg-zinc-800 text-zinc-700'
                      : 'bg-orange-600 text-white active:scale-95'}`}
                >
                  {isSubmitting ? "Agendando..." : "Confirmar"}
                </button>
              )}
            </div>
          </div>
        )}
      </footer>
    </main>
  );
}