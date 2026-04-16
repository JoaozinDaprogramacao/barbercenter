import { Sparkles } from "lucide-react";

export function ChatHeader({ shopName }: { shopName: string }) {
  return (
    <header className="px-6 py-6 border-b border-zinc-900 bg-black/50 backdrop-blur-xl flex items-center justify-between shrink-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
          <Sparkles size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-black text-sm text-white uppercase tracking-wider leading-none">{shopName}</h1>
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Agendamento Online</p>
        </div>
      </div>
    </header>
  );
}