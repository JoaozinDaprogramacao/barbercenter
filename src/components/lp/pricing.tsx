import { Smartphone } from 'lucide-react';

export function Pricing() {
  return (
    <section id="precos" className="w-full bg-black py-24 border-t border-zinc-900/50">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto bg-zinc-900/50 text-white rounded-[3rem] p-10 md:p-16 border border-zinc-800 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
          
          <div className="z-10 text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
              Quais são os planos?
            </h2>
            <p className="text-orange-500 font-bold text-xl md:text-2xl mb-8 tracking-tight">
              Experimente por 45 dias grátis
            </p>
            <div className="flex space-x-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
                <Smartphone size={28} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
                <Smartphone size={28} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-0 text-center z-10 flex flex-col items-center md:items-end">
            <div className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              Oferta de Lançamento
            </div>
            <p className="text-zinc-500 line-through text-lg font-medium mb-1">R$ 49,90</p>
            <div className="flex items-baseline text-white">
              <span className="text-2xl font-bold mr-1">R$</span>
              <span className="text-7xl lg:text-8xl font-black tracking-tighter">32,90</span>
              <span className="text-lg text-zinc-400 ml-2">/mês</span>
            </div>
            <p className="text-sm text-zinc-500 mt-4 font-bold uppercase tracking-widest">No plano semestral</p>
            
            <button className="mt-8 bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter hover:bg-orange-500 hover:text-white transition-all duration-300 active:scale-95">
              Assinar Agora
            </button>
          </div>

          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-600/10 blur-[120px] pointer-events-none group-hover:bg-orange-600/20 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/5 blur-[100px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}