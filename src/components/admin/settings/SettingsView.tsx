"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { ShoppingBag, ChevronRight } from "lucide-react";

import { SettingsHeader } from "./SettingsHeader";
import { CompanySection } from "./CompanySection";
import { ServicesSection } from "./ServicesSection";
import { ServiceEditForm } from "./ServiceEditForm";
import { BusinessHoursSection } from "./BusinessHoursSection";
import { SubscriptionSection } from "./SubscriptionSection";
import { TeamSection } from "./TeamSection";

import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useServices } from "@/hooks/useServices";

// 👇 Importando a nova tela que criamos acima
import { SalesView } from "./SalesView"; 

export const SettingsView = ({ onBack }: { onBack: () => void }) => {
    const { data: session } = useSession();
    const isOwner = (session?.user as any)?.role === "OWNER";

    // 👇 Estado para controlar qual tela estamos vendo (Main Settings ou Sales View)
    const [activeScreen, setActiveScreen] = useState<'MAIN' | 'SALES'>('MAIN');

    const {
        companyData, setCompanyData,
        isEditingCompany, setIsEditingCompany,
        isLoading: isLoadingCompany, isSaving: isSavingCompany, saveCompanyData
    } = useCompanySettings();

    const {
        services,
        isLoading: isLoadingServices,
        saveService,
        deleteService
    } = useServices();

    const [editingService, setEditingService] = useState<any>(null);
    const [isSavingService, setIsSavingService] = useState(false);

    const handleSaveService = async () => {
        if (!editingService || isSavingService) return;
        setIsSavingService(true);
        try {
            await saveService(editingService);
            setEditingService(null);
        } catch (error) {
            console.error("Erro ao salvar serviço:", error);
        } finally {
            setIsSavingService(false);
        }
    };

    const handleDeleteService = async (id: any) => {
        if (isSavingService) return;
        if (typeof id === 'number' || String(id).length < 15) {
            setEditingService(null);
            return;
        }
        setIsSavingService(true);
        try {
            await deleteService(id);
            setEditingService(null);
        } catch (error) {
            console.error("Erro ao deletar serviço:", error);
        } finally {
            setIsSavingService(false);
        }
    };

    // 👇 Renderiza a tela de Vendas se o estado for 'SALES'
    if (activeScreen === 'SALES') {
        return <SalesView onBack={() => setActiveScreen('MAIN')} services={services} />;
    }

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-[#050505] max-w-md mx-auto relative overflow-hidden font-sans border-x border-white/5">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B87333]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-40 left-0 w-64 h-64 bg-[#D49A62]/5 blur-[100px] rounded-full" />
            </div>

            <SettingsHeader onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-32 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
                >
                    <p className="text-[#B87333] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Painel de</p>
                    <h2 className="text-[2.5rem] font-black text-[#F7EFE2] tracking-tighter leading-none">Configurações</h2>
                </motion.div>

                <div className="space-y-12">
                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Perfil da Barbearia</p>
                        </div>
                        {isLoadingCompany ? (
                            <div className="animate-pulse bg-white/[0.02] border border-white/5 h-48 rounded-[2.5rem] w-full"></div>
                        ) : (
                            <CompanySection
                                isEditing={isEditingCompany}
                                data={companyData}
                                isSaving={isSavingCompany}
                                onEdit={() => setIsEditingCompany(true)}
                                onSave={saveCompanyData}
                                onChange={setCompanyData}
                            />
                        )}
                    </section>

                    {isOwner && (
                        <section className="px-1">
                            <SubscriptionSection />
                        </section>
                    )}

                    {/* 👇 NOVO BOTÃO DE ACESSO À TELA DE VENDAS */}
                    <section>
                        <button 
                            onClick={() => setActiveScreen('SALES')}
                            className="w-full bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#B87333]/30 rounded-[2rem] p-6 flex items-center justify-between group hover:border-[#B87333]/60 transition-all shadow-lg active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D49A62] to-[#B87333] flex items-center justify-center shadow-[0_5px_15px_rgba(184,115,51,0.3)] text-[#050505]">
                                    <ShoppingBag size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-[#F7EFE2] font-black text-lg">Catálogo & Ofertas</h3>
                                    <p className="text-[#D49A62] text-[10px] font-bold uppercase tracking-[0.1em] mt-1">Produtos, Upsell e Downsell</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </button>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Horário de Funcionamento</p>
                        </div>
                        {isLoadingCompany ? (
                            <div className="animate-pulse bg-white/[0.02] border border-white/5 h-64 rounded-[2.5rem] w-full"></div>
                        ) : (
                            <BusinessHoursSection
                                isEditing={isEditingCompany}
                                data={companyData}
                                isSaving={isSavingCompany}
                                onEdit={() => setIsEditingCompany(true)}
                                onSave={saveCompanyData}
                                onChange={setCompanyData}
                            />
                        )}
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Catálogo de Serviços</p>
                        </div>
                        {isLoadingServices ? (
                            <div className="animate-pulse bg-white/[0.02] border border-white/5 h-40 rounded-[2.5rem] w-full"></div>
                        ) : (
                            <ServicesSection
                                services={services}
                                editingId={editingService?.id}
                                onAdd={() => setEditingService({ id: Date.now(), name: "", price: "", duration: 30 })}
                                onSelect={(service) => {
                                    const priceFormatted = typeof service.price === 'number'
                                        ? (service.price * 100).toFixed(0)
                                        : service.price;
                                    setEditingService({ ...service, price: priceFormatted });
                                }}
                            />
                        )}
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Gestão de Equipe</p>
                        </div>
                        <TeamSection />
                    </section>
                </div>
            </div>

            <AnimatePresence>
                {editingService && (
                    <ServiceEditForm
                        service={editingService}
                        isOpen={!!editingService}
                        isSaving={isSavingService}
                        onDone={handleSaveService}
                        onRemove={handleDeleteService}
                        onUpdate={(id: any, f: string, v: any) => {
                            setEditingService((prev: any) => ({ ...prev, [f]: v }));
                        }}
                    />
                )}
            </AnimatePresence>
        </main>
    );
};