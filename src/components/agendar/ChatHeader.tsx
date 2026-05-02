import { MoreHorizontal } from "lucide-react";

export function ChatHeader({ shopName }: { shopName: string }) {
  // Pega a primeira letra para fazer um logo (Monograma) dinâmico
  const initial = shopName ? shopName.charAt(0).toUpperCase() : "B";

  return (
    <header className="px-5 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between shrink-0 z-30 sticky top-0">
      <div className="flex items-center gap-3.5">
        
        {/* Avatar Premium (Monograma com borda gradiente) */}
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-b from-orange-500 to-orange-800 p-[1.5px] shadow-lg shadow-orange-900/20">
            <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
              {/* Uma fonte serifada na inicial dá um ar mais clássico de barbearia */}
              <span className="text-orange-50 font-bold text-lg font-serif tracking-tighter">
                {initial}
              </span>
            </div>
          </div>
          {/* Indicador de Status "Online" (Traz a sensação de tempo real) */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2.5px] border-zinc-950" />
        </div>
        
        {/* Textos Refinados */}
        <div className="flex flex-col">
          <h1 className="font-bold text-base text-zinc-100 tracking-tight leading-none">
            {shopName}
          </h1>
          <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase mt-1">
            Atendimento Digital
          </p>
        </div>
      </div>
    </header>
  );
}