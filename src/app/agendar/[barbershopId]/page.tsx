"use client";

import { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useBarberChat } from "@/hooks/useBarberChat";
import { getAvailableTimesForDate } from "@/lib/date-utils";
import { Percent, Loader2 } from "lucide-react"; // <-- Adicionei os ícones

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
    bookedAppointments,
    
    // 🔥 NOVAS PROPS DO UPSELL
    checkUpsellAndProceed,
    isCheckingUpsell,
    activeUpsell,
    acceptUpsellAndProceed
  } = useBarberChat(barbershopId);

  // 🔥 INTERCEPTADOR MÁGICO: Engana o ChatFooter para rodar o Upsell antes do Passo 3
  const handleSetStep = (val: any) => {
      const nextStep = typeof val === 'function' ? val(step) : val;
      if (step === 2 && nextStep === 3) {
          checkUpsellAndProceed();
      } else {
          setStep(nextStep);
      }
  };

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

            {/* 🔥 INDICADOR DE LOADING DO UPSELL */}
            {isCheckingUpsell && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-4 text-[#D49A62]">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Verificando Agenda...</span>
                </motion.div>
            )}

            {/* MOSTRA OS SERVIÇOS QUE O CLIENTE ESCOLHEU (Vai aparecer no Passo 2.5 E no Passo 3) */}
            {step > 2 && (
              <div key="step-services-chosen" className="space-y-8 pt-4">
                <BigChatBubble
                  text={userData.selectedServices.map((s: any) => s.name).join(", ")}
                  isUser
                />
              </div>
            )}

            {/* 🔥 PASSO 2.5: A ISCA DO UPSELL */}
            {step >= 2.5 && activeUpsell && (
                <div key="step-upsell-container" className="space-y-8 pt-4">
                    <BigChatBubble
                        isAi
                        text={activeUpsell.customCopy || "Aproveite esta oferta especial que separei pra você!"}
                    />
                    
                    {/* SÓ MOSTRA O CARD SE ELE AINDA ESTIVER NO PASSO 2.5 */}
                    {step === 2.5 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            className="pl-2 pr-4"
                        >
                            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-[#B87333]/30 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(184,115,51,0.05)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333]/20 blur-2xl rounded-full pointer-events-none" />
                                
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-[#D49A62] to-[#B87333] flex items-center justify-center shadow-[0_5px_15px_rgba(184,115,51,0.3)] shrink-0">
                                        <Percent className="text-[#050505]" size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-[#F7EFE2] font-black text-lg leading-tight">
                                            {availableServices.find(s => s.id === activeUpsell.offerServiceId)?.name}
                                        </p>
                                        <p className="text-[#D49A62] text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                                            {activeUpsell.discountType === 'PERCENTAGE' ? `${activeUpsell.discountAmount}% OFF` : `R$ ${activeUpsell.discountAmount} OFF`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 relative z-10">
                                    <button 
                                        onClick={acceptUpsellAndProceed} 
                                        className="w-full py-4 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        Adicionar à reserva
                                    </button>
                                    <button 
                                        onClick={() => setStep(3)} 
                                        className="w-full py-4 bg-white/5 border border-white/5 text-zinc-400 hover:text-white rounded-[1.5rem] font-bold uppercase tracking-[0.2em] text-[11px] active:scale-95 transition-all"
                                    >
                                        Não, obrigado
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* ESCOLHA DO PROFISSIONAL */}
            {step >= 3 && (
              <div key="step-3-container" className="space-y-8 pt-4">
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
        setStep={handleSetStep} // 🔥 PASSAMOS O INTERCEPTADOR AO INVÉS DO setStep ORIGINAL
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