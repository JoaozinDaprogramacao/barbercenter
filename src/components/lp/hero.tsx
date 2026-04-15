import { Smartphone, Star } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-16 grid md:grid-cols-2 gap-12 items-start">
        <div className="pb-24">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900 tracking-tight">
            Simplifique a forma como você administra <span className="text-orange-600">seu negócio</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-md font-medium">
            Tenha o controle total da sua barbearia na palma da mão. Agendamento online, estoque e equipe em um só lugar.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="bg-black text-white px-8 py-4 rounded-2xl flex items-center space-x-3 hover:opacity-80 transition shadow-xl shadow-slate-200">
              <Smartphone size={22} />
              <div className="text-left leading-none">
                <p className="text-[10px] uppercase font-bold text-slate-400">Disponível na</p>
                <p className="text-base font-bold">App Store</p>
              </div>
            </button>
            <button className="bg-black text-white px-8 py-4 rounded-2xl flex items-center space-x-3 hover:opacity-80 transition shadow-xl shadow-slate-200">
              <Smartphone size={22} />
              <div className="text-left leading-none">
                <p className="text-[10px] uppercase font-bold text-slate-400">Disponível no</p>
                <p className="text-base font-bold">Google Play</p>
              </div>
            </button>
          </div>
          <div className="mt-8 flex items-center space-x-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <span className="text-sm font-bold text-slate-700 tracking-tight">+3.5 mil avaliações</span>
          </div>
        </div>

        <div className="relative flex justify-center h-full min-h-[600px]">
          <div className="-mt-32 relative z-10 w-[380px] h-[800px] lg:w-[420px] lg:h-[880px] bg-slate-900 rounded-[3.5rem] md:rounded-[4rem] border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden transform translate-y-[10%]">
            <div className="absolute top-0 left-0 w-full h-14 flex items-center justify-between px-8 z-20 pointer-events-none">
              <div className="w-16 flex justify-start">
                <span className="text-white text-[14px] font-semibold tracking-wide">9:41</span>
              </div>

              <div className="w-32 h-8 bg-black rounded-full flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 bg-slate-800/80 rounded-full"></div>
              </div>

              <div className="w-16 flex items-center justify-end space-x-1.5 text-white">
                <svg width="16" height="12" viewBox="0 0 18 12" fill="currentColor">
                  <rect x="1" y="8" width="3" height="4" rx="1"/>
                  <rect x="5.5" y="5" width="3" height="7" rx="1"/>
                  <rect x="10" y="2" width="3" height="10" rx="1"/>
                  <rect x="14.5" y="0" width="3" height="12" rx="1"/>
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5.5C4.5 2.5 11.5 2.5 14.5 5.5M4 8C6 6 10 6 12 8M8 11.5v.01" />
                </svg>
                <svg width="24" height="12" viewBox="0 0 25 12" fill="none">
                  <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeWidth="1"/>
                  <rect x="2.5" y="2.5" width="17" height="7" rx="1.5" fill="currentColor"/>
                  <path d="M24 4V8C24.5523 8 25 7.55228 25 7V5C25 4.44772 24.5523 4 24 4Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            <Image
              src="/tela-hero.png"
              alt="Interface do BarberCenter"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          <div className="absolute top-20 right-0 md:-right-4 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-slate-100 animate-bounce-slow">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confirmado</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tighter">34</p>
          </div>
          <div className="absolute top-1/2 left-0 md:-left-8 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hoje</p>
            <p className="text-2xl font-bold text-orange-600 tracking-tighter">16</p>
          </div>
        </div>
      </div>
    </section>
  );
}