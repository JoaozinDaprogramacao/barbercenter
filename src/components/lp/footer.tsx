export function Footer() {
  return (
    <footer className="w-full bg-[#050505] text-[#F7EFE2] py-16 border-t border-white/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[radial-gradient(circle_at_bottom,rgba(184,115,51,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black tracking-tighter">
            BARBER<span className="text-[#D49A62]">CENTER</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-[#D49A62] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#D49A62] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#D49A62] transition-colors">Cookies</a>
          </div>
        </div>
        
        <div className="text-center mt-16 pt-8 border-t border-white/5 text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-black">
          © 2026 BarberCenter — Desenvolvido com foco em resultados
        </div>
      </div>
    </footer>
  );
}