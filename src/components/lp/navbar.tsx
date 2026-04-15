import { Smartphone } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="text-2xl font-bold text-orange-600 tracking-tight">
        BARBER<span className="text-slate-900">CENTER</span>
      </div>
      <div className="hidden md:flex space-x-8 font-medium text-slate-700">
        <a href="#beneficios" className="hover:text-orange-600 transition">Benefícios</a>
        <a href="#precos" className="hover:text-orange-600 transition">Preço</a>
        <a href="#duvidas" className="hover:text-orange-600 transition">Dúvidas</a>
      </div>
      <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-800 transition">
        Entrar
      </button>
    </nav>
  );
}