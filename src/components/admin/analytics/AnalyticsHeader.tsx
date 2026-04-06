"use client";

interface AnalyticsHeaderProps {
  onBack: () => void;
  activeTimeframe: "semana" | "mês" | "ano";
  onSelectTimeframe: (timeframe: "semana" | "mês" | "ano") => void;
  periodLabel: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
}

export const AnalyticsHeader = ({
  onBack,
  activeTimeframe,
  onSelectTimeframe,
  periodLabel,
  onPrevPeriod,
  onNextPeriod
}: AnalyticsHeaderProps) => (
  <header className="px-6 pt-12 pb-2 shrink-0">
    <button onClick={onBack} className="w-10 h-10 flex items-center text-white/60 active:scale-95 transition-all mb-4">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
    </button>
    <div>
      <p className="text-white/40 text-sm font-medium mb-1">Analisar</p>
      <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-6">Faturamento</h2>
    </div>
    <div className="flex bg-white/5 rounded-2xl p-1 mb-4">
      {(["semana", "mês", "ano"] as const).map((t) => (
        <button key={t} onClick={() => onSelectTimeframe(t)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTimeframe === t ? "bg-accent text-black shadow-lg" : "text-white/40 hover:text-white/80"}`}>
          {t}
        </button>
      ))}
    </div>
    <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl p-2">
      <button onClick={onPrevPeriod} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white active:scale-90 transition-all rounded-xl bg-white/5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <span className="text-xs font-black uppercase tracking-widest text-white">{periodLabel}</span>
      <button onClick={onNextPeriod} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white active:scale-90 transition-all rounded-xl bg-white/5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </header>
);