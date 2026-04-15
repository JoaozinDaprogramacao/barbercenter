import { Smartphone, Star } from 'lucide-react';

export function Hero() {
  return (
    <header className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center bg-white overflow-hidden">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
          Simplifique a forma como você administra <span className="text-orange-600">seu negócio</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-md">
          Tenha o controle total da sua barbearia na palma da mão. Agendamento online, estoque e equipe em um só lugar.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:opacity-80 transition">
            <Smartphone size={20} />
            <div className="text-left leading-none">
              <p className="text-[10px] uppercase">Disponível na</p>
              <p className="text-sm font-bold">App Store</p>
            </div>
          </button>
          <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:opacity-80 transition">
            <Smartphone size={20} />
            <div className="text-left leading-none">
              <p className="text-[10px] uppercase">Disponível no</p>
              <p className="text-sm font-bold">Google Play</p>
            </div>
          </button>
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <span className="text-sm font-bold text-slate-700">+3.5 mil avaliações</span>
        </div>
      </div>

      <div className="relative flex justify-center">
        {/* Mockup do App */}
        <div className="relative z-10 w-64 h-[500px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden">
           <div className="bg-orange-600 h-full w-full p-4 flex flex-col justify-end">
              <div className="bg-white/20 h-32 rounded-2xl mb-4" />
              <div className="bg-white/20 h-10 rounded-xl mb-2" />
              <div className="bg-white/20 h-10 rounded-xl" />
           </div>
        </div>
        {/* Floating Cards */}
        <div className="absolute top-10 right-0 md:-right-4 bg-white p-4 rounded-2xl shadow-2xl z-20 border border-slate-100 animate-bounce-slow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmado</p>
          <p className="text-xl font-bold text-slate-900">34</p>
        </div>
        <div className="absolute bottom-20 left-0 md:-left-10 bg-white p-4 rounded-2xl shadow-2xl z-20 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hoje</p>
          <p className="text-xl font-bold text-orange-600">16</p>
        </div>
      </div>
    </header>
  );
}