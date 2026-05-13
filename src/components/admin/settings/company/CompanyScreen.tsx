"use client";

import { maskPhone } from "@/utils/masks";
import { FixedSaveButton } from "../layout/FixedSaveButton"; // Ajuste o caminho conforme sua pasta

export const CompanySection = ({ isEditing, isSaving, data, onEdit, onSave, onChange }: any) => {
  // Pega a primeira letra do nome ou usa 'B' como padrão de Barber
  const displayLetter = data.nome ? data.nome.charAt(0).toUpperCase() : 'B';

  const campos = [
    { chave: 'nome', label: 'Nome Fantasia', placeholder: "Ex: BarberCenter" },
    { chave: 'telefone', label: 'WhatsApp', placeholder: "(00) 00000-0000" },
    { chave: 'endereco', label: 'Endereço', placeholder: "Rua, número e bairro" },
  ];

  return (
    <>
      <div className={`w-full flex flex-col flex-1 ${isEditing ? 'pb-24' : 'pb-10'}`}>
        {/* 1. SEÇÃO DE IDENTIDADE (Avatar de Letra) */}
        <div className="flex flex-col items-center py-12 bg-gradient-to-b from-zinc-900/30 to-transparent">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border-2 border-zinc-800 flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-black text-[#D49A62] select-none">
              {displayLetter}
            </span>
          </div>
          <div className="mt-4 text-center">
              <h2 className="text-white font-bold text-lg">{data.nome || "Sua Barbearia"}</h2>
          </div>
        </div>

        {/* 2. HEADER DA LISTA */}
        <div className="flex justify-between items-end px-5 pb-3 border-b border-zinc-900">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            Dados Públicos
          </h3>
          
          {/* Só mostra o "Alterar" lá em cima se NÃO estiver editando */}
          {!isEditing && (
            <button
              onClick={onEdit}
              className="text-sm font-bold text-[#D49A62] active:opacity-50 transition-all"
            >
              Alterar
            </button>
          )}
        </div>

        {/* 3. LISTA DE DADOS (Estilo iOS/PWA) */}
        <div className="w-full bg-[#080808]">
          {campos.map((item, index) => (
            <div 
              key={item.chave} 
              className={`flex items-center px-5 py-5 min-h-[64px] border-b border-zinc-900/50 last:border-0`}
            >
              <span className="text-[14px] font-medium text-zinc-500 w-24 shrink-0">
                {item.label}
              </span>

              <div className="flex-1 text-right overflow-hidden ml-4">
                {isEditing ? (
                  <input
                    className="w-full bg-transparent text-white text-[15px] font-semibold outline-none text-right placeholder:text-zinc-800"
                    value={item.chave === 'telefone' ? maskPhone((data as any)[item.chave]) : (data as any)[item.chave]}
                    onChange={(e) => {
                      const val = e.target.value;
                      const rawValue = item.chave === 'telefone' ? val.replace(/\D/g, "") : val;
                      onChange({ ...data, [item.chave]: rawValue });
                    }}
                    type={item.chave === 'telefone' ? "tel" : "text"}
                    placeholder={item.placeholder}
                    autoFocus={index === 0}
                  />
                ) : (
                  <p className="text-white text-[15px] font-semibold truncate">
                    {(data as any)[item.chave] 
                      ? (item.chave === 'telefone' ? maskPhone((data as any)[item.chave]) : (data as any)[item.chave])
                      : <span className="text-zinc-800 italic">Pendente</span>
                    }
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4. RODAPÉ DE INFORMAÇÃO */}
        <div className="px-8 py-10 flex-1 bg-[#050505]">
          <p className="text-[11px] text-zinc-600 leading-relaxed text-center max-w-[280px] mx-auto">
            Estes dados são usados para identificar sua barbearia e permitir que clientes se localizem da melhor forma.
          </p>
        </div>
      </div>

      {/* 5. BOTÃO FIXO REUTILIZÁVEL */}
      {isEditing && (
        <FixedSaveButton onSave={onSave} isSaving={isSaving} />
      )}
    </>
  );
};