import { MoreHorizontal } from "lucide-react";

export function ChatHeader({ shopName }: { shopName: string }) {
  const initial = shopName ? shopName.charAt(0).toUpperCase() : "B";

  return (
    <header className="px-5 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between shrink-0 z-30 sticky top-0">
      <div className="flex items-center gap-3.5">
        
        {/* Avatar Premium (Monograma com borda gradiente) */}
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#D49A62] to-[#B87333] p-[1.5px] shadow-[0_0_15px_rgba(184,115,51,0.2)]">
            <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
              <span className="text-[#F7EFE2] font-bold text-lg font-serif tracking-tighter">
                {initial}
              </span>
            </div>
          </div>
          {/* Indicador de Status "Online" (Esmeralda premium) */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-[2.5px] border-[#050505] shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
        </div>
        
        {/* Textos Refinados */}
        <div className="flex flex-col">
          <h1 className="font-black text-base text-[#F7EFE2] tracking-tight leading-none">
            {shopName}
          </h1>
          <p className="text-[9px] text-[#B87333] font-black tracking-[0.2em] uppercase mt-1">
            Atendimento Digital
          </p>
        </div>
      </div>
    </header>
  );
}