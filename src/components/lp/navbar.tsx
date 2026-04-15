import { Smartphone } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-50">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <div className="text-2xl font-bold text-orange-600 tracking-tighter">
          BARBER<span className="text-slate-900">CENTER</span>
        </div>

        <div className="hidden md:flex items-center space-x-10 font-semibold text-sm text-slate-600 uppercase tracking-wide">
          <a href="#beneficios" className="hover:text-orange-600 transition-colors">Benefícios</a>
          <a href="#precos" className="hover:text-orange-600 transition-colors">Preço</a>
          <a href="#duvidas" className="hover:text-orange-600 transition-colors">Dúvidas</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden sm:block text-slate-900 font-bold px-4 hover:text-orange-600 transition-colors">
            Entrar
          </button>
          <button className="bg-slate-900 text-white px-7 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
            Começar Grátis
          </button>
        </div>
      </div>
    </nav>
  );
}