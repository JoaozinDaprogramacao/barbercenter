"use client";

interface BalanceSectionProps {
  total: string;
  bruto: string;
  comissao: string;
  atendimentos: number;
}

export const BalanceSection = ({ total, bruto, comissao, atendimentos }: BalanceSectionProps) => (
  <section className="mt-4">
    <div className="flex justify-between items-center mb-2">
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Balanço Serviços</p>
      <button className="flex items-center gap-1 text-[10px] font-black text-white uppercase tracking-widest">
        Meu Balanço <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>
    <h3 className="text-[2.75rem] font-black text-white leading-none tracking-tighter mb-2">R$ {total}</h3>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">({comissao}) | Valor Bruto: R$ {bruto}</p>
      <p className="text-sm font-bold text-white/60"><span className="text-white">{atendimentos}</span> atendimentos</p>
    </div>
  </section>
);