"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsHeader } from "./SettingsHeader";
import { CompanySection } from "./CompanySection";
import { ServicesSection } from "./ServicesSection";
import { ServiceEditForm } from "./ServiceEditForm";
import { BusinessHoursSection } from "./BusinessHoursSection";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useServices } from "@/hooks/useServices";

export const SettingsView = ({ onBack }: { onBack: () => void }) => {
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

    const handleSaveService = async () => {
        if (!editingService) return;
        await saveService(editingService);
        setEditingService(null);
    };

    const handleDeleteService = async (id: any) => {
        if (typeof id === 'number' || String(id).length < 15) {
            setEditingService(null);
            return;
        }
        await deleteService(id);
        setEditingService(null);
    };

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-black max-w-md mx-auto relative overflow-hidden font-sans border-x border-zinc-900">
            {/* Background Glow Estilizado */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-40 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
            </div>

            <SettingsHeader onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-32 z-10">
                {/* Header da Página */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
                >
                    <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Painel de</p>
                    <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Configurações</h2>
                </motion.div>

                <div className="space-y-12">
                    {/* Seção da Empresa */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Perfil da Barbearia</p>
                        </div>
                        {isLoadingCompany ? (
                            <div className="animate-pulse bg-zinc-900/50 border border-zinc-800 h-48 rounded-[2.5rem] w-full"></div>
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

                    {/* Seção de Horários */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Horário de Funcionamento</p>
                        </div>
                        {isLoadingCompany ? (
                            <div className="animate-pulse bg-zinc-900/50 border border-zinc-800 h-64 rounded-[2.5rem] w-full"></div>
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

                    {/* Seção de Serviços */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Catálogo de Serviços</p>
                        </div>
                        {isLoadingServices ? (
                            <div className="animate-pulse bg-zinc-900/50 border border-zinc-800 h-40 rounded-[2.5rem] w-full"></div>
                        ) : (
                            <ServicesSection
                                services={services}
                                editingId={editingService?.id}
                                onAdd={() => {
                                    setEditingService({ id: Date.now(), name: "", price: "", duration: 30 });
                                }}
                                onSelect={(service) => {
                                    const priceFormatted = typeof service.price === 'number'
                                        ? (service.price * 100).toFixed(0)
                                        : service.price;

                                    setEditingService({ ...service, price: priceFormatted });
                                }}
                            />
                        )}
                    </section>
                </div>
            </div>

            {/* Modal de Edição (Estilo Bottom Sheet) */}
            <AnimatePresence>
                {editingService && (
                    <ServiceEditForm
                        service={editingService}
                        isOpen={!!editingService}
                        onDone={handleSaveService}
                        onRemove={handleDeleteService}
                        onUpdate={(id: any, f: string, v: any) => {
                            setEditingService((prev: any) => ({ ...prev, [f]: v }));
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Fade de fundo para o scroll */}
            <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />
        </main>
    );
};