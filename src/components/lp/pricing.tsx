import { Smartphone } from 'lucide-react';

export function Pricing() {
  return (
    <section id="precos" className="w-full bg-black py-16 md:py-24 border-t border-zinc-900/50">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto bg-zinc-900/50 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 border border-zinc-800 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
          
          {/* Coluna da Esquerda: Textos */}
          <div className="z-10 text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-3 tracking-tight">
              Quais são os planos?
            </h2>
            <p className="text-orange-500 font-bold text-lg md:text-2xl mb-6 md:mb-8 tracking-tight">
              Experimente por 45 dias grátis
            </p>
            
            <div className="flex space-x-3 md:space-x-4">
              <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
                <Smartphone size={24} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
                <Smartphone size={24} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Preço e Botão */}
          <div className="mt-10 md:mt-0 text-center z-10 flex flex-col items-center md:items-end w-full md:w-auto">
            <div className="bg-orange-500/10 text-orange-500 text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 md:mb-4">
              Oferta de Lançamento
            </div>
            
            <p className="text-zinc-500 line-through text-base md:text-lg font-medium mb-1">R$ 49,90</p>
            
            <div className="flex items-baseline text-white">
              <span className="text-xl md:text-2xl font-bold mr-1">R$</span>
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter">
                32,90
              </span>
              <span className="text-base md:text-lg text-zinc-400 ml-2">/mês</span>
            </div>
            
            <p className="text-[10px] md:text-sm text-zinc-500 mt-3 md:mt-4 font-bold uppercase tracking-widest">
              No plano semestral
            </p>
            
            <button className="mt-8 w-full md:w-auto bg-white text-black px-10 py-4 rounded-xl md:rounded-2xl font-black text-sm uppercase tracking-tighter hover:bg-orange-500 hover:text-white transition-all duration-300 active:scale-95 shadow-lg shadow-white/5">
              Assinar Agora
            </button>
          </div>

          {/* Efeitos de Fundo Decorativos */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 md:w-80 md:h-80 bg-orange-600/10 blur-[80px] md:blur-[120px] pointer-events-none group-hover:bg-orange-600/20 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-white/5 blur-[70px] md:blur-[100px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}