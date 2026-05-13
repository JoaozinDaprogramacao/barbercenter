"use client";

import { ChevronLeft } from "lucide-react";
import { ProductsSection } from "./ProductsSection";
import { UpsellSection } from "@/components/admin/settings/salesview/UpsellSection";

export const SalesView = ({ onBack, services }: { onBack: () => void, services: any[] }) => {
    return (
        <main className="h-[100dvh] w-full flex flex-col bg-[#050505] max-w-md mx-auto relative overflow-hidden font-sans border-x border-white/5">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B87333]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-40 left-0 w-64 h-64 bg-[#D49A62]/5 blur-[100px] rounded-full" />
            </div>

            <header className="px-6 py-5 flex items-center justify-between border-b border-white/5 relative z-10 bg-[#050505]/80 backdrop-blur-md">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <p className="text-[#B87333] text-[9px] font-black uppercase tracking-[0.3em]">Gestão de</p>
                    <h1 className="text-lg font-black text-[#F7EFE2] tracking-tight">Catálogo & Ofertas</h1>
                </div>
                <div className="w-10" />
            </header>

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 z-10 no-scrollbar space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Catálogo de Produtos</p>
                    </div>
                    <ProductsSection />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <p className="text-[10px] font-black text-[#D49A62] uppercase tracking-[0.2em]">Vendas Inteligentes</p>
                    </div>
                    <UpsellSection services={services} />
                </section>
            </div>
        </main>
    );
};