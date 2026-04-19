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
import { SubscriptionSection } from "./SubscriptionSection";
import { TeamSection } from "./TeamSection";

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

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-black max-w-md mx-auto relative overflow-hidden font-sans border-x border-zinc-900">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-40 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full" />
            </div>

            <SettingsHeader onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-32 z-10">
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

                    <section className="px-1">
                        <SubscriptionSection />
                    </section>

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
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Gestão de Equipe</p>
                    </div>

                    {/* Aqui você chamará o seu componente TeamSection que listará os barbeiros */}
                    <TeamSection />
                </section>
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