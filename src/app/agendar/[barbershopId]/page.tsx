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

const BigChatBubble = ({ text, isAi, isUser }: { text: string, isAi?: boolean, isUser?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-6 py-5 max-w-[90%] md:max-w-[85%] leading-snug backdrop-blur-md ${isUser
          ? "bg-gradient-to-br from-[#D49A62] to-[#B87333] text-[#050505] rounded-[2rem] rounded-tr-lg text-xl font-bold shadow-[0_5px_15px_rgba(184,115,51,0.25)]"
          : "bg-white/[0.04] border border-white/10 text-[#F7EFE2] rounded-[2rem] rounded-tl-lg text-2xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
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
    shopName, availableServices, businessHours, team,
    isSubmitting, step, setStep, userData, setUserData,
    handleConfirmAppointment,
    totalDuration,
    bookedAppointments
  } = useBarberChat(barbershopId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, userData.date, userData.time, userData.selectedServices, userData.barberId]);

  return (
    <main className="fixed inset-0 flex flex-col bg-[#050505] max-w-md mx-auto border-x border-white/5 overflow-hidden">
      
      {/* Efeitos de Fundo Premium */}
      <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(circle_at_bottom_left,rgba(212,154,98,0.08),transparent_50%)] pointer-events-none" />

      <ChatHeader shopName={shopName} />

      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-6 no-scrollbar">
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

            {/* ESCOLHA DO PROFISSIONAL */}
            {step >= 3 && (
              <div key="step-3-container" className="space-y-8 pt-4">
                <BigChatBubble
                  text={userData.selectedServices.map((s: any) => s.name).join(", ")}
                  isUser
                />
                <BigChatBubble isAi text="Com qual profissional você prefere agendar?" />

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 pl-2">
                  <button
                    disabled={step > 3}
                    onClick={() => {
                      setUserData((prev: any) => ({ ...prev, barberId: "", barberName: "Qualquer profissional" }));
                    }}
                    className={`p-5 rounded-[1.8rem] border text-left text-lg font-bold transition-all backdrop-blur-md ${
                      userData.barberName === "Qualquer profissional"
                        ? "bg-[#B87333]/15 border-[#B87333]/40 text-[#D49A62] shadow-[inset_0_1px_0_rgba(184,115,51,0.2)]"
                        : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.04] hover:border-white/10"
                      } ${step > 3 ? "opacity-60 cursor-default" : "active:scale-[0.98]"}`}
                  >
                    Qualquer profissional
                  </button>

                  {team?.map((member: any) => (
                    <button
                      key={member.id}
                      disabled={step > 3}
                      onClick={() => {
                        setUserData((prev: any) => ({ ...prev, barberId: member.id, barberName: member.name }));
                      }}
                      className={`p-5 rounded-[1.8rem] border text-left text-lg font-bold transition-all backdrop-blur-md ${
                        userData.barberId === member.id
                          ? "bg-[#B87333]/15 border-[#B87333]/40 text-[#D49A62] shadow-[inset_0_1px_0_rgba(184,115,51,0.2)]"
                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.04] hover:border-white/10"
                        } ${step > 3 ? "opacity-60 cursor-default" : "active:scale-[0.98]"}`}
                    >
                      {member.name}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}

            {/* DATA E HORA */}
            {step >= 4 && (
              <div key="step-4-container" className="space-y-8 pt-4">
                <BigChatBubble text={userData.barberName} isUser />
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
                        availableTimes={getAvailableTimesForDate(
                          userData.date,
                          businessHours,
                          bookedAppointments,
                          totalDuration,
                          team,              
                          userData.barberId    
                        )}
                        onChange={(time) => setUserData((prev: any) => ({ ...prev, time }))}
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {/* SUCESSO */}
            {step === 5 && <SuccessState date={userData.date} time={userData.time} />}
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