"use client";

import { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useBarberChat } from "@/hooks/useBarberChat";
import { getAvailableTimesForDate } from "@/lib/date-utils";
import { Percent, Package } from "lucide-react";

import { ChatHeader } from "@/components/agendar/ChatHeader";
import { ChatFooter } from "@/components/agendar/ChatFooter";
import { SuccessState } from "@/components/agendar/SuccessState";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";

const BigChatBubble = ({ text, isAi, isUser, delay = 0 }: { text: string, isAi?: boolean, isUser?: boolean, delay?: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay }}
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

const UpsellSkeleton = () => (
  <motion.div
    key="upsell-skeleton"
    initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
    transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
    className="space-y-8 w-full"
  >
    <div className="flex w-full justify-start">
      <div className="px-6 py-5 w-[85%] bg-white/[0.03] border border-white/5 rounded-[2rem] rounded-tl-lg animate-pulse">
        <div className="h-4 bg-white/10 rounded-full w-2/3 mb-3" />
        <div className="h-4 bg-white/10 rounded-full w-1/2" />
      </div>
    </div>

    <div className="pl-2 pr-4">
      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-[1.2rem] bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-5 bg-white/10 rounded-full w-3/4" />
            <div className="h-3 bg-[#D49A62]/30 rounded-full w-1/3" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-[44px] bg-[#D49A62]/20 rounded-[1.5rem] w-full" />
          <div className="h-[44px] bg-white/5 rounded-[1.5rem] w-full" />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function BarberChat() {
  const params = useParams();
  const barbershopId = params.barbershopId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    shopName, availableServices, businessHours, team,
    isSubmitting, step, setStep, userData, setUserData,
    handleConfirmAppointment,
    totalDuration,
    bookedAppointments,
    checkUpsellAndProceed,
    isCheckingUpsell,
    activeUpsell,
    acceptUpsellAndProceed
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

  // 👇 Função auxiliar para calcular o preço final e formatar
  const getCalculatedPrice = (upsell: any) => {
    if (!upsell || !upsell.servicePrice) return null;
    
    const originalPrice = Number(upsell.servicePrice);
    let finalPrice = originalPrice;

    if (upsell.discountType === 'PERCENTAGE') {
      finalPrice = originalPrice - (originalPrice * (Number(upsell.discountAmount) / 100));
    } else {
      finalPrice = originalPrice - Number(upsell.discountAmount);
    }

    return {
      original: `R$ ${originalPrice.toFixed(2).replace('.', ',')}`,
      final: `R$ ${Math.max(0, finalPrice).toFixed(2).replace('.', ',')}`
    };
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-[#050505] max-w-md mx-auto border-x border-white/5 overflow-hidden">

      <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(circle_at_bottom_left,rgba(212,154,98,0.08),transparent_50%)] pointer-events-none" />

      <ChatHeader shopName={shopName} />

      <div className="relative z-10 flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="space-y-8 pb-10">
          <AnimatePresence mode="popLayout">

            <BigChatBubble
              key="welcome-msg"
              isAi
              text={`Olá! Bem-vindo(a) à ${shopName}. Como podemos te chamar?`}
            />

            {step >= 2 && (
              <motion.div layout key="step-2-container" className="space-y-8 pt-4">
                <BigChatBubble text={userData.name} isUser />
                <BigChatBubble
                  isAi
                  text={`Prazer, ${userData.name.split(" ")[0]}! Qual serviço vamos fazer hoje?`}
                />
              </motion.div>
            )}

            {step > 2 && (
              <motion.div layout key="step-services-chosen" className="space-y-8 pt-4">
                <BigChatBubble
                  text={userData.selectedServices.map((s: any) => s.name).join(", ")}
                  isUser
                />
              </motion.div>
            )}

            {step >= 2.5 && step < 3 && (
              <div key="upsell-wrapper" className="pt-4">
                <AnimatePresence mode="wait">
                  {isCheckingUpsell ? (
                    <UpsellSkeleton key="upsell-skeleton" />
                  ) : activeUpsell ? (
                    <motion.div
                      key={`step-upsell-${activeUpsell.id}`}
                      initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                      transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                      className="space-y-8"
                    >
                      <BigChatBubble
                        isAi
                        text={activeUpsell.customCopy || "Aproveite esta oferta especial que separei pra você!"}
                      />

                      <div className="pl-2 pr-4">
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-[#B87333]/30 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(184,115,51,0.05)] relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333]/20 blur-2xl rounded-full pointer-events-none" />

                          <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-[#D49A62] to-[#B87333] flex items-center justify-center shadow-[0_5px_15px_rgba(184,115,51,0.3)] shrink-0">
                              {activeUpsell.offerType === 'PRODUCT' ? (
                                <Package className="text-[#050505]" size={24} strokeWidth={2.5} />
                              ) : (
                                <Percent className="text-[#050505]" size={24} strokeWidth={2.5} />
                              )}
                            </div>
                            <div>
                              <p className="text-[#F7EFE2] font-black text-lg leading-tight">
                                {activeUpsell.offerName}
                              </p>
                              
                              {/* 👇 Nova lógica de preço "De X Por Y" */}
                              {getCalculatedPrice(activeUpsell) ? (
                                <p className="text-[11px] font-bold mt-1">
                                  <span className="text-zinc-500 line-through mr-2">
                                    {getCalculatedPrice(activeUpsell)?.original}
                                  </span>
                                  <span className="text-[#D49A62] uppercase tracking-[0.1em]">
                                    Por {getCalculatedPrice(activeUpsell)?.final}
                                  </span>
                                </p>
                              ) : (
                                <p className="text-[#D49A62] text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                                  {activeUpsell.discountType === 'PERCENTAGE' ? `${activeUpsell.discountAmount}% OFF` : `R$ ${activeUpsell.discountAmount} OFF`}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 relative z-10">
                            <button
                              onClick={acceptUpsellAndProceed}
                              className="w-full py-4 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                              Adicionar à reserva
                            </button>
                            {/* 👇 Novo texto de recusa */}
                            <button
                              onClick={() => setStep(3)}
                              className="w-full py-4 bg-white/5 border border-white/5 text-zinc-400 hover:text-white rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-[11px] active:scale-95 transition-all"
                            >
                              Perder essa oportunidade
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )}

            {step >= 3 && (
              <motion.div layout key="step-3-container" className="space-y-8 pt-4">
                <BigChatBubble isAi text="Com qual profissional você prefere agendar?" />

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 pl-2">
                  <button
                    disabled={step > 3}
                    onClick={() => {
                      setUserData((prev: any) => ({ ...prev, barberId: "", barberName: "Qualquer profissional" }));
                    }}
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
                      onClick={() => {
                        setUserData((prev: any) => ({ ...prev, barberId: member.id, barberName: member.name }));
                      }}
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
        onNextName={(name) => {
          setUserData((prev: any) => ({ ...prev, name }));
          setStep(2);
        }}
        onConfirm={handleConfirmAppointment}
      />
    </main>
  );
}