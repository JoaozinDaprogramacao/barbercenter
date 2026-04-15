import { Smartphone } from 'lucide-react';

export function Pricing() {
  return (
    <section id="precos" className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto bg-zinc-900 text-white rounded-[2.5rem] p-12 border border-zinc-800 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="z-10 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Quais são os planos?</h2>
          <p className="text-orange-500 font-bold text-xl mb-6 tracking-tight">Experimente por 45 dias</p>
          <div className="flex space-x-4 justify-center md:justify-start">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10"><Smartphone size={24}/></div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10"><Smartphone size={24}/></div>
          </div>
        </div>
        <div className="mt-8 md:mt-0 text-center z-10">
          <p className="text-zinc-500 line-through text-sm">R$ 49,90</p>
          <div className="flex items-baseline justify-center">
            <span className="text-sm font-bold">R$</span>
            <span className="text-6xl font-extrabold mx-1">32,90</span>
            <span className="text-sm text-zinc-400">/mês</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 font-medium">no plano semestral</p>
        </div>
        {/* Background glow effect */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/20 blur-[100px]" />
      </div>
    </section>
  );
}