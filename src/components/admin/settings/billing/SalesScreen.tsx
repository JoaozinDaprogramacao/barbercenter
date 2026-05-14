"use client";

// 1. IMPORTS CORRETOS (Ajuste os caminhos se suas pastas forem diferentes)
import { ScreenLayout } from "../layout/ScreenLayout"; 
import { ProductsSection } from "./../sales/ProductsSection"; 
import { UpsellSection } from "./../sales/UpsellSection"; // ou "@/components/admin/settings/sales/UpsellSection"

interface SalesViewProps {
  onBack: () => void;
  services: any[];
}

export const SalesView = ({ onBack, services }: SalesViewProps) => {
  return (
    // O ScreenLayout já cria o cabeçalho preto perfeito sem a palavra "Voltar"
    <ScreenLayout title="Catálogo" onBack={onBack}>
      
      {/* O flex-1 bg-[#050505] aqui garante que a faixa cinza desapareça */}
      <div className="flex flex-col flex-1 bg-[#050505]">
        
        {/* Seção de Produtos */}
        <ProductsSection />
        
        {/* Linha Divisória de Sistema (Separa Produtos de Ofertas) */}
        <div className="w-full h-3 bg-[#080808] border-y border-zinc-900/50 my-2"></div>

        {/* Seção de Upsell (Ofertas) */}
        <UpsellSection services={services} />
        
        {/* Preenchimento final para empurrar a tela até o fundo */}
        <div className="flex-1 bg-[#050505] min-h-[150px]"></div>
        
      </div>
      
    </ScreenLayout>
  );
};