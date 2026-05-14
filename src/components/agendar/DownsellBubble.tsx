import { motion, AnimatePresence } from "framer-motion";
import { Percent, Package, AlertTriangle } from "lucide-react";

export const DownsellBubble = ({
  isChecking,
  downsell,
  availableServices,
  availableProducts,
  onAccept,
  onDecline
}: any) => {

  const getCalculatedPrice = () => {
    if (!downsell) return null;
    
    const linkedItem = availableServices?.find(
      (s: any) => s.id === downsell.serviceId || s.id === downsell.productId || s.name === downsell.offerName
    );
    const linkedProduct = availableProducts?.find(
      (p: any) => p.id === downsell.productId || p.name === downsell.offerName
    );

    let rawPrice = downsell.originalPrice || downsell.servicePrice || downsell.productPrice || downsell.basePrice || linkedItem?.price || linkedProduct?.price;

    if (typeof rawPrice === 'string') {
      rawPrice = rawPrice.replace(/[^\d.,]/g, '').replace(',', '.');
    }

    const originalPrice = Number(rawPrice);

    if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0) return null; 

    let finalPrice = originalPrice;
    if (downsell.discountType === 'PERCENTAGE') {
      finalPrice = originalPrice - (originalPrice * (Number(downsell.discountAmount) / 100));
    } else {
      finalPrice = originalPrice - Number(downsell.discountAmount);
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
          key="downsell-skeleton"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-8 w-full pl-2 pr-4 pt-6"
        >
          <div className="p-6 rounded-[2rem] bg-[#100D0B] border border-white/5 animate-pulse mt-4 h-48" />
        </motion.div>
      ) : downsell ? (
        <motion.div
          key={`step-downsell-${downsell.id}`}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="space-y-8 w-full"
        >
          <div className="flex w-full justify-start">
             <div className="px-6 py-5 max-w-[85%] leading-snug backdrop-blur-md bg-white/[0.04] border border-white/10 text-[#F7EFE2] rounded-[2rem] rounded-tl-lg text-lg font-semibold">
               {downsell.customCopy || "Tudo bem, entendi! Mas antes de finalizarmos, e se eu adicionar isso com um valor minúsculo?"}
             </div>
          </div>

          <div className="pl-2 pr-4 pt-6"> 
            {/* O visual do downsell é mais contido, focado na pechincha */}
            <div className="p-6 rounded-[2rem] bg-[#1A1512] border border-[#D49A62]/30 relative shadow-2xl">
              
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-zinc-900 text-zinc-300 text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-full border border-zinc-700 flex items-center justify-center gap-2 z-20 w-max shadow-lg">
                <AlertTriangle size={14} className="text-[#D49A62]" />
                <div className="text-center leading-[1.3]">
                  Última<br/>Oferta
                </div>
              </div>

              <div className="flex items-center gap-4 mb-5 relative z-10 pt-3">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                  {downsell.offerType === 'PRODUCT' ? (
                    <Package className="text-[#D49A62]" size={28} />
                  ) : (
                    <Percent className="text-[#D49A62]" size={28} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[#F7EFE2] font-bold text-xl leading-tight">
                    {downsell.offerName}
                  </p>
                </div>
              </div>

              <div className="mb-6 flex flex-col items-center justify-center bg-black/40 p-4 rounded-xl border border-white/5">
                {priceData ? (
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 line-through text-sm font-medium">
                      {priceData.original}
                    </span>
                    <span className="text-[#D49A62] text-3xl font-black">
                      {priceData.final}
                    </span>
                  </div>
                ) : (
                  <p className="text-[#D49A62] text-lg font-black uppercase tracking-widest">
                    {downsell.discountType === 'PERCENTAGE' ? `${downsell.discountAmount}% DE DESCONTO` : `R$ ${downsell.discountAmount} DE DESCONTO`}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-4 relative z-10">
                <button
                  onClick={onAccept}
                  className="w-full py-4 bg-[#D49A62] text-[#050505] rounded-[1rem] font-black uppercase tracking-[0.1em] text-xs hover:bg-[#E6B981] active:scale-95 transition-all"
                >
                  Ok, esse valor eu aceito!
                </button>
                
                <button
                  onClick={onDecline}
                  className="text-zinc-500 hover:text-zinc-400 font-medium uppercase tracking-[0.05em] text-[10px] active:scale-95 transition-all"
                >
                  Não, seguir para agendamento
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};