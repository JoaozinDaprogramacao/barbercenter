export function Footer() {
  return (
    <footer className="w-full bg-black text-white py-16 border-t border-zinc-900">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-bold tracking-tighter">
            BARBER<span className="text-orange-600">CENTER</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition">Termos de Uso</a>
            <a href="#" className="hover:text-white transition">Privacidade</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
        
        <div className="text-center mt-16 pt-8 border-t border-zinc-900/50 text-zinc-600 text-[10px] tracking-[0.2em] uppercase font-medium">
          © 2026 BarberCenter — Desenvolvido com foco em resultados
        </div>
      </div>
    </footer>
  );
}