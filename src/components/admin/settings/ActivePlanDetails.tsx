import { Crown, CalendarCheck, CheckCircle2 } from 'lucide-react';

interface ActivePlanDetailsProps {
  expiresAt?: string | Date;
}

export function ActivePlanDetails({ expiresAt }: ActivePlanDetailsProps) {
  // Formata a data de expiração para o padrão brasileiro (Ex: 15 de Maio de 2026)
  const formattedDate = expiresAt 
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(expiresAt))
    : 'Data não disponível';

  return (
    <div className="relative overflow-hidden bg-emerald-950/20 border border-emerald-900/40 rounded-[2.5rem] p-8 group">
      {/* Luz de fundo esmeralda */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#10B981]/10 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full flex items-center justify-center mb-4">
          <Crown className="text-[#10B981]" size={32} />
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-2">
          InBarber <span className="text-[#10B981]">PRO</span>
        </h3>

        <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-6 max-w-[240px]">
          Sua barbearia está operando com potência máxima. Todos os recursos ilimitados estão liberados.
        </p>

        <div className="w-full bg-black/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <CheckCircle2 size={14} className="text-[#10B981]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
            </div>
            <span className="text-xs font-black text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-md uppercase tracking-wider">
              Ativo
            </span>
          </div>

          <div className="w-full h-px bg-zinc-800/50" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <CalendarCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Válido até</span>
            </div>
            <span className="text-xs font-bold text-white">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}