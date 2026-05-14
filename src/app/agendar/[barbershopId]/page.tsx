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
import { BigChatBubble } from "@/components/agendar/BigChatBubble";
import { UpsellBubble } from "@/components/agendar/UpsellBubble";
import { DownsellBubble } from "@/components/agendar/DownsellBubble";

export default function BarberChat() {
  const params = useParams();
  const barbershopId = params.barbershopId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    shopName,
    availableServices,
    availableProducts,
    businessHours,
    team,
    isSubmitting, step, setStep, userData, setUserData,
    handleConfirmAppointment,
    totalDuration,
    bookedAppointments,
    checkUpsellAndProceed,
    isCheckingUpsell,
    activeUpsell,
    acceptUpsellAndProceed,
    handleDeclineUpsell,
    activeDownsell,
    isCheckingDownsell,
    acceptDownsellAndProceed,
    declineDownsellAndProceed
  } = useBarberChat(barbershopId);

  const handleSetStep = (val: any) => {
    const nextStep = typeof val === 'function' ? val(step) : val;

    if (nextStep === 2 && step > 2) {
      setUserData((prev: any) => ({
        ...prev,
        selectedServices: prev.selectedServices.filter((s: any) => !s.isUpsell)
      }));
      setStep(nextStep);
      return;
    }

    if (step === 2 && nextStep === 3) {
      setStep(2.5);
      checkUpsellAndProceed();
    } else {
      setStep(nextStep);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    const timeout = setTimeout(scrollToBottom, 800);
    return () => clearTimeout(timeout);
  }, [step, userData.date, userData.time, userData.selectedServices, userData.barberId, activeUpsell, isCheckingUpsell]);

  const formatDisplayDate = (date: string) => {
    if (!date) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split("-").map(Number);
      const parsedDate = new Date(year, month - 1, day);

      return parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      });
    }

    const [day, month, year] = date.split("-");

    if (day && month && year) {
      return `${day} de ${month} de ${year}`;
    }

    return date;
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-[#050505] max-w-md mx-auto border-x border-white/5 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(circle_at_bottom_left,rgba(212,154,98,0.08),transparent_50%)] pointer-events-none" />

      <ChatHeader shopName={shopName} />

      <div className="relative z-10 flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="space-y-8 pb-10">
          <AnimatePresence mode="popLayout">

            <BigChatBubble key="welcome-msg" isAi text={`Olá! Bem-vindo(a) à ${shopName}. Como podemos te chamar?`} />

            {step >= 2 && (
              <motion.div layout key="step-2-container" className="space-y-8 pt-4">
                <BigChatBubble text={userData.name} isUser />
                <BigChatBubble isAi text={`Prazer, ${userData.name.split(" ")[0]}! Qual serviço vamos fazer hoje?`} />
              </motion.div>
            )}

            {step > 2 && (
              <motion.div layout key="step-services-chosen" className="space-y-8 pt-4">
                <BigChatBubble text={userData.selectedServices.map((s: any) => s.name).join(", ")} isUser />
              </motion.div>
            )}

            {step === 2.5 && (
              <div key="upsell-wrapper" className="pt-4">
                <UpsellBubble
                  isChecking={isCheckingUpsell}
                  upsell={activeUpsell}
                  availableServices={availableServices}
                  availableProducts={availableProducts}
                  onAccept={acceptUpsellAndProceed}
                  onDecline={handleDeclineUpsell}
                />
              </div>
            )}

            {step === 2.7 && (
              <div key="downsell-wrapper" className="pt-4">
                <DownsellBubble
                  isChecking={isCheckingDownsell}
                  downsell={activeDownsell}
                  availableServices={availableServices}
                  availableProducts={availableProducts}
                  onAccept={acceptDownsellAndProceed}
                  onDecline={declineDownsellAndProceed}
                />
              </div>
            )}

            {step >= 3 && (
              <motion.div layout key="step-3-container" className="space-y-8 pt-4">
                <BigChatBubble isAi text="Com qual profissional você prefere agendar?" />

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 pl-2">
                  <button
                    disabled={step > 3}
                    onClick={() => setUserData((prev: any) => ({ ...prev, barberId: "", barberName: "Qualquer profissional" }))}
                    className={`p-5 rounded-[1.8rem] border text-left text-lg font-bold transition-all backdrop-blur-md ${userData.barberName === "Qualquer profissional"
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
                      onClick={() => setUserData((prev: any) => ({ ...prev, barberId: member.id, barberName: member.name }))}
                      className={`p-5 rounded-[1.8rem] border text-left text-lg font-bold transition-all backdrop-blur-md ${userData.barberId === member.id
                        ? "bg-[#B87333]/15 border-[#B87333]/40 text-[#D49A62] shadow-[inset_0_1px_0_rgba(184,115,51,0.2)]"
                        : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.04] hover:border-white/10"
                        } ${step > 3 ? "opacity-60 cursor-default" : "active:scale-[0.98]"}`}
                    >
                      {member.name}
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {step >= 4 && (
              <motion.div layout key="step-4-container" className="space-y-8 pt-4">
                <BigChatBubble text={userData.barberName} isUser />
                <BigChatBubble isAi text="Qual dia fica melhor para você?" />

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <DateSelector value={userData.date} onChange={(date) => setUserData((prev: any) => ({ ...prev, date }))} />
                </motion.div>

                {userData.date && (
                  <div className="space-y-6 pt-4">
                    <BigChatBubble isAi text={`Perfeito! Escolha um horário para ${formatDisplayDate(userData.date)}:`} />
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <TimeGrid
                        value={userData.time}
                        availableTimes={getAvailableTimesForDate(userData.date, businessHours, bookedAppointments, totalDuration, team, userData.barberId)}
                        onChange={(time) => setUserData((prev: any) => ({ ...prev, time }))}
                      />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 5 && <SuccessState key="success" date={userData.date} time={userData.time} />}

            <div key="scroll-anchor" ref={messagesEndRef} className="h-2" />
          </AnimatePresence>
        </div>
      </div>

      <ChatFooter
        step={step}
        setStep={handleSetStep}
        userData={userData}
        setUserData={setUserData}
        availableServices={availableServices}
        isSubmitting={isSubmitting}
        onNextName={(name) => { setUserData((prev: any) => ({ ...prev, name })); setStep(2); }}
        onConfirm={handleConfirmAppointment}
      />
    </main>
  );
}