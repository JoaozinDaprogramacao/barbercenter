"use client";

import { ChevronLeft } from "lucide-react";
import { ProductsSection } from "../sales/ProductsSection";

import { UpsellSection } from "@/components/admin/settings/sales/UpsellSection";

export const SalesView = ({ onBack, services }: { onBack: () => void, services: any[] }) => {
    return (
        <main className="h-[100dvh] w-full flex flex-col bg-[#050505] max-w-md mx-auto relative overflow-hidden font-sans">
            {/* Header Estilo Barra de Título Nativa */}
            <header className="px-4 py-4 flex items-center border-b border-zinc-900 bg-[#050505] sticky top-0 z-20">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-1 text-[#D49A62] active:opacity-50 transition-opacity"
                >
                    <ChevronLeft size={24} />
                    <span className="text-sm font-medium">Voltar</span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-white uppercase tracking-widest">Catálogo</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                {/* Seção de Produtos */}
                <ProductsSection />

                {/* Seção de Upsell */}
                <UpsellSection services={services} />
            </div>
        </main>
    );
};