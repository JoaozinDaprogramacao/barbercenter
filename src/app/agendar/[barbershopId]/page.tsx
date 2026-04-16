"use client";

import { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useBarberChat } from "@/hooks/useBarberChat";
import { getAvailableTimesForDate } from "@/lib/date-utils";

import { ChatHeader } from "@/components/agendar/ChatHeader";
import { ChatFooter } from "@/components/agendar/ChatFooter";
import { SuccessState } from "@/components/agendar/SuccessState";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";

// Bolha de chat padrão, mas com escala e fontes maiores
const BigChatBubble = ({ text, isAi, isUser }: { text: string, isAi?: boolean, isUser?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-6 py-5 max-w-[90%] md:max-w-[85%] shadow-md leading-snug ${
          isUser
            ? "bg-orange-600 text-white rounded-[2rem] rounded-tr-lg text-xl font-bold"
            : "bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-[2rem] rounded-tl-lg text-2xl font-semibold"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
};

export default function BarberChat() {
  const params = useParams();
  const barbershopId = params.barbershopId as string;
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    shopName, availableServices, businessHours,
    isSubmitting, step, setStep, userData, setUserData,
    handleConfirmAppointment
  } = useBarberChat(barbershopId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, userData.date, userData.time]);

  return (
    <main className="fixed inset-0 flex flex-col bg-black max-w-md mx-auto border-x border-zinc-900">
      <ChatHeader shopName={shopName} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="space-y-8 pb-10">
          <AnimatePresence mode="popLayout">
            
            <BigChatBubble
              key="welcome-msg"
              isAi
              text={`Olá! Bem-vindo(a) à ${shopName}. Como podemos te chamar?`}
            />

            {step >= 2 && (
              <div key="step-2-container" className="space-y-8 pt-4">
                <BigChatBubble text={userData.name} isUser />
                <BigChatBubble
                  isAi
                  text={`Prazer, ${userData.name.split(" ")[0]}! Qual serviço vamos fazer hoje?`}
                />
              </div>
            )}

            {step >= 3 && (
              <div key="step-3-container" className="space-y-8 pt-4">
                <BigChatBubble text={userData.serviceName} isUser />
                <BigChatBubble isAi text="Qual dia fica melhor para você?" />

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <DateSelector
                    value={userData.date}
                    onChange={(date) => setUserData((prev: any) => ({ ...prev, date }))}
                  />
                </motion.div>

                {userData.date && (
                  <div className="space-y-6 pt-4">
                    <BigChatBubble
                      isAi
                      text={`Perfeito! Escolha um horário para ${userData.date.replace('-', ' de ')}:`}
                    />
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <TimeGrid
                        value={userData.time}
                        availableTimes={getAvailableTimesForDate(userData.date, businessHours)}
                        onChange={(time) => setUserData((prev: any) => ({ ...prev, time }))}
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && <SuccessState date={userData.date} time={userData.time} />}
          </AnimatePresence>
        </div>
      </div>

      <ChatFooter 
        step={step}
        setStep={setStep}
        userData={userData}
        setUserData={setUserData}
        availableServices={availableServices}
        isSubmitting={isSubmitting}
        onNextName={(name) => {
          setUserData((prev: any) => ({ ...prev, name }));
          setStep(2);
        }}
        onConfirm={handleConfirmAppointment}
      />
    </main>
  );
}