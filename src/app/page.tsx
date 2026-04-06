import { ChatBubble } from "@/components/ChatBubble";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";

export default function BarberChat() {
  return (
    <div className="min-h-screen bg-[#050505] text-text-primary flex items-center justify-center p-0 md:p-6 lg:p-12">
      {/* Removemos o h-screen fixo. O container agora cresce conforme o conteúdo até o limite da tela */}
      <main className="w-full max-w-6xl bg-surface/30 md:glass flex flex-col md:flex-row md:rounded-[32px] overflow-hidden shadow-2xl border-none md:border md:border-white/5 transition-all">
        
        {/* Sidebar: No PC ela acompanha a altura da Dashboard. No Mobile ela é o topo. */}
        <aside className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-black/20 shrink-0 border-b md:border-b-0 md:border-r border-white/5">
          <header className="p-6 border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-gradient border border-white/10" />
              <div>
                <h1 className="font-bold text-lg leading-none">InBarber</h1>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Assistant</span>
                </div>
              </div>
            </div>
          </header>

          {/* O scroll aqui só aparece se as mensagens excederem a altura da dashboard ao lado */}
          <div className="flex-1 p-6 space-y-4 overflow-y-visible md:overflow-y-auto no-scrollbar">
            <ChatBubble isAi text="Olá! Que bom te ver por aqui." />
            <ChatBubble isAi text="Selecione o dia e horário que melhor funcionam para você ao lado para reservarmos sua vaga." />
            
            {/* Mobile Only Viewport */}
            <div className="md:hidden space-y-8 pt-4">
              <DateSelector />
              <TimeGrid />
            </div>
          </div>
        </aside>

        {/* Dashboard: Ocupa o espaço necessário sem forçar scroll se houver tela */}
        <section className="hidden md:flex flex-1 flex-col justify-center p-8 lg:p-16 bg-background/40">
          <div className="max-w-2xl w-full mx-auto space-y-10">
            <header>
              <h2 className="text-4xl font-black tracking-tight mb-3">Reserve seu horário</h2>
              <p className="text-text-secondary text-lg font-medium">Agenda aberta para Abril de 2026.</p>
            </header>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">1. Selecione a Data</h3>
              <DateSelector />
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">2. Escolha o Horário</h3>
              <TimeGrid />
            </div>

            <div className="pt-6">
              <button className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-zinc-100">
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </section>

        {/* Footer Mobile Fixado apenas se necessário */}
        <footer className="md:hidden p-6 bg-black border-t border-white/5">
          <button className="w-full bg-white text-black py-4 rounded-xl font-bold">
            Confirmar Agendamento
          </button>
        </footer>
      </main>
    </div>
  );
}