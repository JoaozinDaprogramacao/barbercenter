"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { ShoppingBag, Store, Clock, Scissors, Users, Star } from "lucide-react";

import { SettingsHeader } from "./layout/SettingsHeader";
import { CompanySection } from "./company/CompanyScreen";
import { ServicesSection } from "./services/ServiceScreen";
import { ServiceEditForm } from "./services/ServiceEditForm";
import { BusinessHoursSection } from "./company/BusinessHoursSection";
import { SubscriptionSection } from "./billing/SubscriptionScreen";
import { TeamSection } from "./team/TeamScreen";

import { ScreenLayout } from "./layout/ScreenLayout"
import { MenuItem } from "./layout/MenuItem"

import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useServices } from "@/hooks/useServices";
import { SalesView } from "./billing/SalesScreen";



// ==========================================
// TELA PRINCIPAL: ROTEADOR DE CONFIGURAÇÕES
// ==========================================
export const SettingsView = ({ onBack }: { onBack: () => void }) => {
    const { data: session } = useSession();
    const isOwner = (session?.user as any)?.role === "OWNER";

    const [activeScreen, setActiveScreen] = useState<'MAIN' | 'PROFILE' | 'HOURS' | 'SERVICES' | 'SALES' | 'TEAM' | 'SUBSCRIPTION'>('MAIN');

    const {
        companyData, setCompanyData,
        isEditingCompany, setIsEditingCompany,
        isLoading: isLoadingCompany, isSaving: isSavingCompany, saveCompanyData
    } = useCompanySettings();

    const {
        services, isLoading: isLoadingServices, saveService, deleteService
    } = useServices();

    const [editingService, setEditingService] = useState<any>(null);
    const [isSavingService, setIsSavingService] = useState(false);

    const handleSaveService = async () => {
        if (!editingService || isSavingService) return;
        setIsSavingService(true);
        try {
            await saveService(editingService);
            setEditingService(null);
        } catch (error) { console.error(error); } 
        finally { setIsSavingService(false); }
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
        } catch (error) { console.error(error); } 
        finally { setIsSavingService(false); }
    };


    if (activeScreen === 'PROFILE') {
        return (
            <ScreenLayout title="Dados da Barbearia" onBack={() => setActiveScreen('MAIN')}>
                {isLoadingCompany ? (
                    <div className="animate-pulse bg-zinc-900/50 h-48 w-full rounded-[2rem]"></div>
                ) : (
                    <div className="space-y-10">
                        <CompanySection isEditing={isEditingCompany} data={companyData} isSaving={isSavingCompany} onEdit={() => setIsEditingCompany(true)} onSave={saveCompanyData} onChange={setCompanyData} />
                    </div>
                )}
            </ScreenLayout>
        );
    }

    if (activeScreen === 'HOURS') {
        return (
            <ScreenLayout title="Horários" onBack={() => setActiveScreen('MAIN')}>
                {isLoadingCompany ? (
                    <div className="animate-pulse bg-zinc-900/50 h-64 w-full rounded-[2rem]"></div>
                ) : (
                    <div className="space-y-10">
                        <BusinessHoursSection isEditing={isEditingCompany} data={companyData} isSaving={isSavingCompany} onEdit={() => setIsEditingCompany(true)} onSave={saveCompanyData} onChange={setCompanyData} />
                    </div>
                )}
            </ScreenLayout>
        );
    }

    if (activeScreen === 'SERVICES') {
        return (
            <ScreenLayout title="Catálogo" onBack={() => setActiveScreen('MAIN')}>
                {isLoadingServices ? (
                    <div className="animate-pulse bg-zinc-900/50 h-40 w-full rounded-[2rem]"></div>
                ) : (
                    <div className="space-y-10">
                        <ServicesSection services={services} editingId={editingService?.id} onAdd={() => setEditingService({ id: Date.now(), name: "", price: "", duration: 30 })} onSelect={(service) => { const priceFormatted = typeof service.price === 'number' ? (service.price * 100).toFixed(0) : service.price; setEditingService({ ...service, price: priceFormatted }); }} />
                    </div>
                )}
                <AnimatePresence>
                    {editingService && (
                        <ServiceEditForm service={editingService} isOpen={!!editingService} isSaving={isSavingService} onDone={handleSaveService} onRemove={handleDeleteService} onUpdate={(id: any, f: string, v: any) => { setEditingService((prev: any) => ({ ...prev, [f]: v })); }} />
                    )}
                </AnimatePresence>
            </ScreenLayout>
        );
    }

    if (activeScreen === 'TEAM') {
        return (
            <ScreenLayout title="Sua Equipe" onBack={() => setActiveScreen('MAIN')}>
                <div className="space-y-10">
                    <TeamSection />
                </div>
            </ScreenLayout>
        );
    }

    if (activeScreen === 'SUBSCRIPTION') {
        return (
            <ScreenLayout title="Configurações de Plano" onBack={() => setActiveScreen('MAIN')}>
                <div className="space-y-10">
                    <SubscriptionSection />
                </div>
            </ScreenLayout>
        );
    }

    if (activeScreen === 'SALES') {
        return <SalesView onBack={() => setActiveScreen('MAIN')} services={services} />;
    }

    // ==========================================
    // RENDERIZAÇÃO DO MENU PRINCIPAL (MAIN)
    // ==========================================
    return (
        <main className="h-[100dvh] w-full flex flex-col bg-[#050505] max-w-md mx-auto relative overflow-hidden font-sans border-x border-white/5">
            <SettingsHeader onBack={onBack} />

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                <header className="px-6 pt-10 pb-12">
                    <p className="text-[#B87333] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Preferências</p>
                    <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Ajustes</h2>
                </header>

                <div className="space-y-10">
                    {/* Bloco 1: A Empresa */}
                    <section>
                        <div className="px-7 mb-3">
                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Informações Gerais</p>
                        </div>
                        <div className="w-full border-y border-zinc-900 bg-[#050505]">
                            <MenuItem icon={Store} title="Perfil da Barbearia" subtitle="Nome, logo e localização" onClick={() => setActiveScreen('PROFILE')} />
                            <MenuItem icon={Clock} title="Horários de Operação" subtitle="Agenda de funcionamento" onClick={() => setActiveScreen('HOURS')} />
                            {isOwner && (
                                <MenuItem icon={Star} title="Meu Plano" subtitle="Gerenciar assinatura" onClick={() => setActiveScreen('SUBSCRIPTION')} />
                            )}
                        </div>
                    </section>

                    {/* Bloco 2: Operação Diária */}
                    <section>
                        <div className="px-7 mb-3">
                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Serviços e Vendas</p>
                        </div>
                        <div className="w-full border-y border-zinc-900 bg-[#050505]">
                            <MenuItem icon={Scissors} title="Serviços Oferecidos" subtitle="Gerenciar cortes e barbas" onClick={() => setActiveScreen('SERVICES')} />
                            <MenuItem icon={ShoppingBag} title="Catálogo & Ofertas" subtitle="Produtos, Upsell e Downsell" onClick={() => setActiveScreen('SALES')} />
                            <MenuItem icon={Users} title="Equipe de Barbeiros" subtitle="Membros e acessos" onClick={() => setActiveScreen('TEAM')} />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};