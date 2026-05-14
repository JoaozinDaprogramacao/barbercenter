"use client";

import { Crown } from 'lucide-react';

interface ActivePlanDetailsProps {
  expiresAt?: string | Date;
}

export function ActivePlanDetails({ expiresAt }: ActivePlanDetailsProps) {
  // Formata a data de expiração para o padrão brasileiro (Ex: 15 de Maio de 2026)
  const formattedDate = expiresAt 
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(expiresAt))
    : 'Data não disponível';

  return (
    <div className="w-full flex flex-col flex-1 pb-10">
      
      {/* 1. SEÇÃO HERO (Destaque do Plano) */}
      <div className="flex flex-col items-center py-12 bg-[#050505]">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D49A62]/10 to-transparent border border-[#D49A62]/20 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(212,154,98,0.05)]">
          <Crown className="text-[#D49A62]" size={40} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-3xl font-black text-white tracking-tight text-center">
          BarberCenter <span className="text-[#D49A62]">PRO</span>
        </h2>
        
        <p className="text-[13px] text-zinc-500 font-medium text-center mt-3 px-8 max-w-[300px]">
          Sua barbearia está operando com potência máxima e recursos ilimitados.
        </p>
      </div>

      {/* 2. HEADER DA LISTA */}
      <div className="flex justify-between items-end px-5 pb-3">
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
          Detalhes da Assinatura
        </h3>
      </div>

      {/* 3. LISTA DE DADOS (Estilo iOS/PWA) */}
      <div className="w-full bg-[#080808] border-y border-zinc-900">
        
        {/* Linha Status */}
        <div className="flex items-center px-5 py-5 min-h-[64px] border-b border-zinc-900/50">
          <span className="text-[14px] font-medium text-zinc-500 w-28 shrink-0">
            Status
          </span>
          <div className="flex-1 text-right">
            <span className="text-[11px] font-black text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg uppercase tracking-widest">
              Ativo
            </span>
          </div>
        </div>

        {/* Linha Vencimento */}
        <div className="flex items-center px-5 py-5 min-h-[64px]">
          <span className="text-[14px] font-medium text-zinc-500 w-28 shrink-0">
            Vencimento
          </span>
          <div className="flex-1 text-right">
            <span className="text-[15px] font-semibold text-white truncate">
              {formattedDate}
            </span>
          </div>
        </div>

      </div>

      {/* 4. FOOTER INFORMATIVO */}
      <div className="px-8 py-10 flex-1 bg-[#050505]">
        <p className="text-[11px] text-zinc-600 leading-relaxed text-center max-w-[280px] mx-auto">
          Sua assinatura garante acesso a todas as atualizações de IA, gestão de catálogo e agendamentos inteligentes.
        </p>
      </div>
      
    </div>
  );
}