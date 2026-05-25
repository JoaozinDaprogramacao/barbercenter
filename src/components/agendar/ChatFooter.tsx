import { useState, useRef } from "react";
import { Send, ChevronLeft } from "lucide-react";
import { ServiceSelector } from "@/components/ServiceSelector";

interface ChatFooterProps {
  step: number;
  setStep: (step: any) => void;
  userData: any;
  setUserData: (data: any) => void;
  availableServices: any[];
  isSubmitting: boolean;
  onNextName: (name: string) => void;
  onNextPhone: (phone: string) => void;
  onConfirm: () => void;
}

export function ChatFooter({
  step, setStep, userData, setUserData, availableServices, isSubmitting, onNextName, onNextPhone, onConfirm
}: ChatFooterProps) {
  const [inputValue, setInputValue] = useState("");
  const actionLockRef = useRef(false);

  const handleNameSubmit = () => {
    if (actionLockRef.current || inputValue.trim().length < 2) return;
    actionLockRef.current = true;
    onNextName(inputValue.trim());
    setInputValue("");
    setTimeout(() => { actionLockRef.current = false; }, 300);
  };

  const handlePhoneSubmit = () => {
    if (actionLockRef.current || inputValue.trim().length < 8) return;
    actionLockRef.current = true;
    onNextPhone(inputValue.trim());
    setInputValue("");
    setTimeout(() => { actionLockRef.current = false; }, 300);
  };

  const handleGoBack = () => {
    if (step === 4) {
      if (userData.date || userData.time) {
        setUserData((prev: any) => ({ ...prev, date: "", time: "" }));
      } else {
        setStep(3);
      }
    } else if (step === 3) {
      setUserData((prev: any) => ({ ...prev, barberId: "", barberName: "" }));
      setStep(2);
    } else if (step === 2) {
      setStep(1.5);
    } else if (step === 1.5) {
      setStep(1);
    }
  };

  if (step >= 5) return null;

  const hasSelectedServices = userData.selectedServices?.length > 0;

  return (
    <footer className="p-6 bg-[#050505]/90 backdrop-blur-md border-t border-white/5 shrink-0 z-30 pb-safe">
      {step === 1 && (
        <div className="flex gap-2 bg-white/[0.03] border border-white/10 p-2 rounded-[2rem] focus-within:border-[#B87333]/50 transition-all shadow-inner">
          <input
            type="text"
            placeholder="Escreva seu nome..."
            className="flex-1 bg-transparent px-4 py-2 text-[#F7EFE2] outline-none text-sm font-medium placeholder:text-zinc-600"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
          />
          <button
            onClick={handleNameSubmit}
            className="w-12 h-12 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-all shadow-[0_5px_15px_rgba(184,115,51,0.25)]"
          >
            <Send size={18} strokeWidth={2.5} className="-ml-0.5" />
          </button>
        </div>
      )}

      {step === 1.5 && (
        <div className="flex gap-2">
          <button
            onClick={handleGoBack}
            className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-[1.5rem] flex items-center justify-center text-zinc-400 active:scale-95 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2] shrink-0"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex flex-1 gap-2 bg-white/[0.03] border border-white/10 p-2 rounded-[2rem] focus-within:border-[#B87333]/50 transition-all shadow-inner">
            <input
              type="tel"
              placeholder="DDD + WhatsApp..."
              className="flex-1 bg-transparent px-4 py-2 text-[#F7EFE2] outline-none text-sm font-medium placeholder:text-zinc-600 w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
            />
            <button
              onClick={handlePhoneSubmit}
              className="w-12 h-12 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] flex items-center justify-center active:scale-90 transition-all shadow-[0_5px_15px_rgba(184,115,51,0.25)] shrink-0"
            >
              <Send size={18} strokeWidth={2.5} className="-ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {(step >= 2 && step <= 4) && (
        <div className="flex flex-col gap-4">

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <ServiceSelector
                services={availableServices}
                selectedIds={userData.selectedServices?.map((s: any) => s.id) || []}
                onSelect={(id, name) => {
                  setUserData((prev: any) => {
                    const current = prev.selectedServices || [];
                    const exists = current.find((s: any) => s.id === id);
                    if (exists) {
                      return { ...prev, selectedServices: current.filter((s: any) => s.id !== id) };
                    }
                    return { ...prev, selectedServices: [...current, { id, name }] };
                  });
                }}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-[1.5rem] flex items-center justify-center text-zinc-400 active:scale-95 transition-all hover:border-[#B87333]/40 hover:text-[#F7EFE2]"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            {step === 2 && hasSelectedServices && (
              <button
                onClick={() => setStep(3)}
                className="flex-1 h-14 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-[0_5px_15px_rgba(184,115,51,0.25)] animate-in fade-in slide-in-from-bottom-2"
              >
                Continuar com {userData.selectedServices.length} {userData.selectedServices.length > 1 ? 'itens' : 'item'}
              </button>
            )}

            {step === 3 && userData.barberName && (
              <button
                onClick={() => setStep(4)}
                className="flex-1 h-14 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-[0_5px_15px_rgba(184,115,51,0.25)] animate-in fade-in slide-in-from-bottom-2"
              >
                Continuar
              </button>
            )}

            {step === 4 && (
              <button
                disabled={!userData.date || !userData.time || isSubmitting}
                onClick={onConfirm}
                className={`flex-1 h-14 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all
                  ${(!userData.date || !userData.time || isSubmitting)
                    ? 'bg-white/[0.03] border border-white/5 text-zinc-600'
                    : 'bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] shadow-[0_5px_15px_rgba(184,115,51,0.25)] active:scale-95'}`}
              >
                {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
              </button>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}