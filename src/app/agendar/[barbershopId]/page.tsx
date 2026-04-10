"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { ChatBubble } from "@/components/ChatBubble";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";
import { ServiceSelector } from "@/components/ServiceSelector";

export default function BarberChat() {
  const params = useParams();
  const barbershopId = params.barbershopId as string;

  // Estados dos dados dinâmicos
  const [shopName, setShopName] = useState("Carregando...");
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState(1);
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

  // 1. BUSCA OS DADOS DA BARBEARIA ASSIM QUE ABRE O LINK
  useEffect(() => {
    if (!barbershopId) return;

    fetch(`/api/public/barbershop/${barbershopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          setShopName(data.name);
          setAvailableServices(data.services || []);
          // Armazena as configurações de horário da barbearia
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToNextStepWithName();
    }
  };

  const handleGoBack = () => {
    if (step === 3) {
      if (userData.date) {
        // Se já escolheu a data, limpa data e hora mas fica no passo 3
        setUserData((prev) => ({ ...prev, date: "", time: "" }));
      } else {
        // Se não escolheu data, volta para os serviços (passo 2)
        setUserData((prev) => ({ ...prev, serviceId: "", serviceName: "" }));
        setStep(2);
      }
    } else if (step === 2) {
      // Volta para o nome
      setStep(1);
    }
  };

  // 2. FUNÇÃO QUE SALVA NO BANCO
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
      setStep(4); // Vai pra tela de sucesso
    } catch (error) {
      alert("Erro ao agendar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlots = (start: string, end: string) => {
    const slots = [];
    let [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endTime) {
      const hour = currentTime.getHours().toString().padStart(2, "0");
      const minute = currentTime.getMinutes().toString().padStart(2, "0");
      slots.push(`${hour}:${minute}`);

      // Adiciona 30 minutos por slot - ajuste conforme necessário
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  const getAvailableTimesForDate = (selectedDate: string) => {
    if (!businessHours || !selectedDate) return [];

    const monthMap: Record<string, number> = {
      "jan": 0, "fev": 1, "mar": 2, "abr": 3, "mai": 4, "jun": 5,
      "jul": 6, "ago": 7, "set": 8, "out": 9, "nov": 10, "dez": 11
    };

    const parts = selectedDate.split("-");
    if (parts.length !== 2) return [];

    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase();
    const monthIndex = monthMap[monthStr];
    const currentYear = new Date().getFullYear();

    const dateObj = new Date(currentYear, monthIndex, day);
    const dayOfWeek = dateObj.getDay();

    const dayConfig = businessHours[dayOfWeek];

    // 👇 AQUI ESTAVA O ERRO: Trocamos start/end por openTime/closeTime
    if (!dayConfig || !dayConfig.isOpen || !dayConfig.openTime || !dayConfig.closeTime) {
      return [];
    }

    // 👇 AQUI TAMBÉM
    let slots = generateSlots(dayConfig.openTime, dayConfig.closeTime);

    const today = new Date();
    if (
      today.getDate() === day &&
      today.getMonth() === monthIndex &&
      today.getFullYear() === currentYear
    ) {
      const nowTime = today.getHours() * 60 + today.getMinutes();
      slots = slots.filter(slot => {
        const [h, m] = slot.split(':').map(Number);
        return (h * 60 + m) > nowTime + 30;
      });
    }

    return slots;
  };

  return (
    <main className="absolute inset-0 flex flex-col bg-[#050505] max-w-2xl mx-auto overflow-hidden">
      <header className="p-4 border-b border-white/5 bg-[#0A0A0A] flex items-center gap-3 shrink-0 z-20">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
            <path d="M19 19L5 5" strokeDasharray="4 4" />
            <path d="M5 19L19 5" />
          </svg>
        </div>
        <div>
          {/* Nome Dinâmico da Barbearia */}
          <h1 className="font-bold text-[16px] text-white tracking-wide">{shopName}</h1>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5 leading-none">Agendamento Rápido</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar flex flex-col z-10">
        <div className="mt-auto space-y-6 pb-2">

          <ChatBubble isAi isBig text={`Olá! Bem-vindo(a) à ${shopName}. Qual o seu nome?`} />

          {step >= 2 && (
            <>
              <ChatBubble text={userData.name} />
              <ChatBubble isAi isBig text={`Prazer, ${userData.name.split(" ")[0]}! Qual serviço vamos fazer hoje?`} />
            </>
          )}

          {step >= 3 && (
            <>
              {/* Exibe o nome do serviço escolhido */}
              <ChatBubble text={userData.serviceName} />
              <ChatBubble isAi isBig text="Qual dia fica melhor para você?" />

              <div className="space-y-6 pt-2">
                <DateSelector
                  value={userData.date}
                  onChange={(date) => setUserData(prev => ({ ...prev, date }))}
                />

                {userData.date && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ChatBubble isAi isBig text={`Perfeito! Quais destes horários para ${userData.date.replace('-', ' de ')}?`} />
                    <TimeGrid
                      value={userData.time}
                      availableTimes={getAvailableTimesForDate(userData.date)} // Função que filtra o businessHours
                      onChange={(time) => setUserData(prev => ({ ...prev, time }))}
                    />
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
              <h2 className="text-2xl font-black text-white text-center mb-2">Agendamento Confirmado!</h2>
              <p className="text-zinc-400 text-center max-w-[250px] text-sm mb-8">
                Tudo certo, <strong>{userData.name.split(" ")[0]}</strong>! Te esperamos dia {userData.date.split('-')[0]} às {userData.time}.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Realizar novo agendamento
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="p-4 bg-[#0A0A0A] border-t border-white/5 shrink-0 z-20 pb-safe">
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

        {(step === 2 || step === 3) && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3">
            {step === 2 && (
              <ServiceSelector
                // PASSA A LISTA DE SERVIÇOS DO BANCO AQUI:
                services={availableServices}
                onSelect={(serviceId, serviceName) => {
                  setUserData((prev) => ({ ...prev, serviceId, serviceName }));
                  setStep(3);
                }}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={handleGoBack}
                className="flex-1 bg-zinc-900 text-zinc-400 py-4 rounded-xl font-bold border border-white/5 active:scale-95 transition-all"
              >
                Corrigir anterior
              </button>

              {step === 3 && (
                <button
                  disabled={!userData.date || !userData.time || isSubmitting}
                  onClick={handleConfirmAppointment} // CHAMA A FUNÇÃO DE SALVAR
                  className={`flex-[2] py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl
              ${(!userData.date || !userData.time || isSubmitting)
                      ? 'bg-zinc-800 text-zinc-600 opacity-50'
                      : 'bg-white text-black active:scale-95'}`}
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