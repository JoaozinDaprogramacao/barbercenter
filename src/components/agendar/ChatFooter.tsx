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
  onConfirm: () => void;
}

export function ChatFooter({ 
  step, setStep, userData, setUserData, availableServices, isSubmitting, onNextName, onConfirm 
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

  const handleGoBack = () => {
    if (step === 3) {
      if (userData.date || userData.time) {
        setUserData((prev: any) => ({ ...prev, date: "", time: "" }));
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(1);
    }
  };

  if (step === 4) return null;

  // Verificação de segurança para múltiplos serviços
  const hasSelectedServices = userData.selectedServices?.length > 0;

  return (
    <footer className="p-6 bg-zinc-950 border-t border-zinc-900 shrink-0 z-30 pb-safe">
      {step === 1 && (
        <div className="flex gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-[2rem]">
          <input
            type="text"
            placeholder="Escreva seu nome..."
            className="flex-1 bg-transparent px-4 py-2 text-white outline-none text-sm font-medium"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
          />
          <button
            onClick={handleNameSubmit}
            className="w-11 h-11 bg-orange-600 text-white rounded-full flex items-center justify-center active:scale-90 transition-all"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {(step === 2 || step === 3) && (
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
              className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 active:scale-95 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Layout para o passo 2 (Seleção de Serviço) */}
            {step === 2 && hasSelectedServices && (
              <button
                onClick={() => setStep(3)}
                className="flex-1 h-14 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 animate-in fade-in slide-in-from-bottom-2"
              >
                Continuar com {userData.selectedServices.length} {userData.selectedServices.length > 1 ? 'itens' : 'item'}
              </button>
            )}

            {/* Layout para o passo 3 (Data e Hora) */}
            {step === 3 && (
              <button
                disabled={!userData.date || !userData.time || isSubmitting}
                onClick={onConfirm}
                className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all
                  ${(!userData.date || !userData.time || isSubmitting)
                    ? 'bg-zinc-800 text-zinc-700'
                    : 'bg-orange-600 text-white active:scale-95'}`}
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