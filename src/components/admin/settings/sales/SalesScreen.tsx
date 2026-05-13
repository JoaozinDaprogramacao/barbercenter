"use client";

import { ScreenLayout } from "../layout/ScreenLayout"; 
import { ProductsSection } from "./ProductsSection";
// Importe o UpsellSection aqui quando estiver refatorado:
// import { UpsellSection } from "./UpsellSection";

interface SalesScreenProps {
  onBack: () => void;
  // services: any[]; // Descomente quando for usar o Upsell
}

export const SalesScreen = ({ onBack }: SalesScreenProps) => {
  return (
    <ScreenLayout title="Catálogo" onBack={onBack}>
      <div className="flex flex-col flex-1 bg-[#050505]">
        
        {/* Seção 1: Estoque e Vendas (Produtos) */}
        <ProductsSection />
        
        {/* Divisor sutil para separar as seções (Descomente quando tiver Ofertas) */}
        {/* <div className="w-full h-2 bg-[#080808] border-y border-zinc-900/50 my-2"></div> */}

        {/* Seção 2: Ofertas e Upsell */}
        {/* <UpsellSection services={services} /> */}
        
        {/* Preenchimento infinito para matar a faixa cinza */}
        <div className="flex-1 bg-[#050505] min-h-[150px]"></div>
      </div>
    </ScreenLayout>
  );
};