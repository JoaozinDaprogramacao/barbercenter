export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-6 md:mb-0 tracking-tighter">
          BARBER<span className="text-orange-600">CENTER</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500 mb-8 md:mb-0">
          <a href="#" className="hover:text-white transition">Termos de Uso</a>
          <a href="#" className="hover:text-white transition">Privacidade</a>
          <a href="#" className="hover:text-white transition">Cookies</a>
        </div>

        <div className="flex space-x-4">
          {/* Placeholders para badges de App Store */}
          <div className="h-10 w-28 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center grayscale opacity-50 hover:opacity-100 transition cursor-pointer">
            <span className="text-[10px] font-bold">APP STORE</span>
          </div>
          <div className="h-10 w-28 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center grayscale opacity-50 hover:opacity-100 transition cursor-pointer">
            <span className="text-[10px] font-bold">GOOGLE PLAY</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12 text-zinc-600 text-[10px] tracking-[0.2em] uppercase font-medium">
        © 2026 BarberCenter — Desenvolvido com foco em resultados
      </div>
    </footer>
  );
}