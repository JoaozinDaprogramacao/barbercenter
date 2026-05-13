import { motion, AnimatePresence } from "framer-motion";
import { Percent, Package } from "lucide-react";
// O BigChatBubble não será usado nesta visualização exata da imagem,
// mas vou manter a importação caso precise para o texto da IA antes do card.

export const UpsellBubble = ({
  isChecking,
  upsell,
  availableServices,
  availableProducts, // <-- Adicionado aqui
  onAccept,
  onDecline
}: any) => {

  const getCalculatedPrice = () => {
    if (!upsell) return null;
    
    // Procura nos Serviços
    const linkedItem = availableServices?.find(
      (s: any) => s.id === upsell.serviceId || s.id === upsell.productId || s.name === upsell.offerName
    );

    // Procura nos Produtos
    const linkedProduct = availableProducts?.find(
      (p: any) => p.id === upsell.productId || p.name === upsell.offerName
    );

    let rawPrice = upsell.originalPrice 
                || upsell.servicePrice 
                || upsell.productPrice
                || upsell.basePrice 
                || linkedItem?.price
                || linkedProduct?.price; // <-- Tenta puxar o preço do produto também

    if (typeof rawPrice === 'string') {
      rawPrice = rawPrice.replace(/[^\d.,]/g, '').replace(',', '.');
    }

    const originalPrice = Number(rawPrice);

    if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0) {
      return null; 
    }

    let finalPrice = originalPrice;
    if (upsell.discountType === 'PERCENTAGE') {
      finalPrice = originalPrice - (originalPrice * (Number(upsell.discountAmount) / 100));
    } else {
      finalPrice = originalPrice - Number(upsell.discountAmount);
    }

    const savedAmount = originalPrice - finalPrice;

    return {
      original: `R$ ${originalPrice.toFixed(2).replace('.', ',')}`,
      final: `R$ ${Math.max(0, finalPrice).toFixed(2).replace('.', ',')}`,
      saved: `R$ ${savedAmount.toFixed(2).replace('.', ',')}`
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
          className="space-y-8 w-full pl-2 pr-4 pt-6"
        >
          <div className="p-6 rounded-[2rem] bg-[#100D0B] border border-white/5 animate-pulse relative mt-4">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-red-600/50 rounded-full" />
             <div className="flex items-center gap-4 mb-6 pt-4">
                <div className="w-16 h-16 rounded-2xl bg-[#C18350]/30 shrink-0" />
                <div className="h-6 bg-white/10 rounded-full w-1/2" />
             </div>
             <div className="h-[72px] bg-black/40 rounded-2xl w-full mb-6" />
             <div className="h-[52px] bg-[#C18350]/30 rounded-full w-full" />
          </div>
        </motion.div>
      ) : upsell ? (
        <motion.div
          key={`step-upsell-${upsell.id}`}
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
          className="space-y-8 w-full"
        >
          {/* Se quiser manter um balão da IA avisando da oferta, deixe aqui. 
              Se quiser SÓ o card da foto, você pode remover esse BigChatBubble abaixo */}
          <div className="flex w-full justify-start">
             <div className="px-6 py-5 max-w-[85%] leading-snug backdrop-blur-md bg-white/[0.04] border border-white/10 text-[#F7EFE2] rounded-[2rem] rounded-tl-lg text-lg font-semibold">
               {upsell.customCopy || "Aproveite esta oferta especial que separei pra você!"}
             </div>
          </div>

          <div className="pl-2 pr-4 pt-6"> 
            <div className="p-6 rounded-[2rem] bg-[#100D0B] border border-[#B87333]/20 relative overflow-visible shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
              
              {/* Etiqueta Vermelha Exata da Imagem */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FF2A2A] text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,42,42,0.5)] flex items-center justify-center gap-2 z-20 w-max">
                <span className="text-yellow-300 text-xs">🔥</span>
                <div className="text-center leading-[1.3]">
                  Desbloqueado<br/>para você
                </div>
              </div>

              {/* Brilho sutil no fundo igual na imagem */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333]/5 blur-3xl rounded-full pointer-events-none" />

              {/* Ícone e Título */}
              <div className="flex items-center gap-4 mb-6 relative z-10 pt-3">
                <div className="w-16 h-16 rounded-[1.2rem] bg-[#C18350] flex items-center justify-center shadow-[0_0_25px_rgba(193,131,80,0.15)] shrink-0">
                  {upsell.offerType === 'PRODUCT' ? (
                    <Package className="text-[#100D0B]" size={34} strokeWidth={2.5} />
                  ) : (
                    <Percent className="text-[#100D0B]" size={34} strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[#F7EFE2] font-black text-2xl leading-tight tracking-tight">
                    {upsell.offerName}
                  </p>
                </div>
              </div>

              {/* Caixa Interna Preta de Preço */}
              <div className="mb-8 p-4 rounded-[1rem] bg-[#050505] flex items-center justify-between relative z-10">
                {priceData ? (
                  <>
                    <div className="flex flex-col items-start justify-center gap-1.5">
                      <span className="text-zinc-500 line-through text-[11px] font-medium tracking-wide">
                        De {priceData.original}
                      </span>
                      <span className="text-[#00E57B] text-[9px] font-black uppercase tracking-wider bg-[#00E57B]/10 px-2 py-1 rounded-md">
                        Economize {priceData.saved}
                      </span>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-zinc-400 text-[8px] uppercase tracking-[0.2em] mb-1">
                        Por apenas
                      </span>
                      <span className="text-[#D49A62] text-[28px] font-black leading-none tracking-tighter">
                        {priceData.final}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center py-2">
                     <p className="text-[#D49A62] text-lg font-black uppercase tracking-widest">
                      {upsell.discountType === 'PERCENTAGE' ? `${upsell.discountAmount}% DE DESCONTO` : `R$ ${upsell.discountAmount} DE DESCONTO`}
                    </p>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col items-center gap-6 relative z-10">
                <button
                  onClick={onAccept}
                  className="w-full py-4 bg-gradient-to-r from-[#D49A62] via-[#E6B981] to-[#B87333] text-[#050505] rounded-full font-black uppercase tracking-[0.1em] text-xs shadow-[0_0_20px_rgba(184,115,51,0.25)] hover:brightness-110 active:scale-95 transition-all"
                >
                  Sim, quero aproveitar!
                </button>
                
                <button
                  onClick={onDecline}
                  className="text-zinc-500 hover:text-zinc-300 font-semibold uppercase tracking-[0.1em] text-[9px] active:scale-95 transition-all underline decoration-zinc-800 underline-offset-4"
                >
                  Não, prefiro pagar o valor normal
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};