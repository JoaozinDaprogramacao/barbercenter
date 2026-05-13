import { motion, AnimatePresence } from "framer-motion";
import { Percent, Package } from "lucide-react";
import { BigChatBubble } from "./BigChatBubble"; // Assumindo que você vai separar ele também

export const UpsellBubble = ({
  isChecking,
  upsell,
  availableServices,
  onAccept,
  onDecline
}: any) => {

  // 👇 CORREÇÃO AQUI: Busca o preço original nos serviços disponíveis caso não venha no upsell
  const getCalculatedPrice = () => {
    if (!upsell) return null;
    
    // Procura o serviço vinculado ao Upsell para pegar o preço base
    const linkedService = availableServices?.find((s: any) => s.id === upsell.serviceId);
    const originalPrice = Number(upsell.servicePrice || linkedService?.price);

    if (!originalPrice || isNaN(originalPrice)) return null;

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

  const priceData = getCalculatedPrice();

  return (
    <AnimatePresence mode="wait">
      {isChecking ? (
        <motion.div
          key="upsell-skeleton"
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
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
      ) : upsell ? (
        <motion.div
          key={`step-upsell-${upsell.id}`}
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
          className="space-y-8"
        >
          <BigChatBubble
            isAi
            text={upsell.customCopy || "Aproveite esta oferta especial que separei pra você!"}
          />

          <div className="pl-2 pr-4">
            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-[#B87333]/30 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(184,115,51,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333]/20 blur-2xl rounded-full pointer-events-none" />

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-[#D49A62] to-[#B87333] flex items-center justify-center shadow-[0_5px_15px_rgba(184,115,51,0.3)] shrink-0">
                  {upsell.offerType === 'PRODUCT' ? (
                    <Package className="text-[#050505]" size={24} strokeWidth={2.5} />
                  ) : (
                    <Percent className="text-[#050505]" size={24} strokeWidth={2.5} />
                  )}
                </div>
                <div>
                  <p className="text-[#F7EFE2] font-black text-lg leading-tight">
                    {upsell.offerName}
                  </p>
                  
                  {/* 👇 Agora vai funcionar certinho com o preço dos services */}
                  {priceData ? (
                    <p className="text-[11px] font-bold mt-1">
                      <span className="text-zinc-500 line-through mr-2">
                        {priceData.original}
                      </span>
                      <span className="text-[#D49A62] uppercase tracking-[0.1em]">
                        Por {priceData.final}
                      </span>
                    </p>
                  ) : (
                    <p className="text-[#D49A62] text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                      {upsell.discountType === 'PERCENTAGE' ? `${upsell.discountAmount}% OFF` : `R$ ${upsell.discountAmount} OFF`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={onAccept}
                  className="w-full py-4 bg-gradient-to-r from-[#D49A62] to-[#B87333] text-[#050505] rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Adicionar à reserva
                </button>
                <button
                  onClick={onDecline}
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
  );
};