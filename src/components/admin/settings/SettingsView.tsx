"use client";
import { useState } from "react";
import { SettingsHeader } from "./SettingsHeader";
import { CompanySection } from "./CompanySection";
import { ServicesSection } from "./ServicesSection";
import { ServiceEditForm } from "./ServiceEditForm";
import { BusinessHoursSection } from "./BusinessHoursSection";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useServices } from "@/hooks/useServices"; // <-- 1. Importamos o Hook novo

export const SettingsView = ({ onBack }: { onBack: () => void }) => {
    // Dados da Empresa
    const {
        companyData, setCompanyData,
        isEditingCompany, setIsEditingCompany,
        isLoading: isLoadingCompany, isSaving: isSavingCompany, saveCompanyData
    } = useCompanySettings();

    // Dados dos Serviços
    const {
        services,
        isLoading: isLoadingServices,
        saveService,
        deleteService
    } = useServices();

    // Estado do formulário de edição do serviço
    const [editingService, setEditingService] = useState<any>(null);

    // Funções para lidar com o modal
    const handleSaveService = async () => {
        if (!editingService) return;
        await saveService(editingService);
        setEditingService(null); // Fecha o modal depois de salvar
    };

    const handleDeleteService = async (id: any) => {
        // Se for um ID numérico (temporário, não salvo no banco ainda), só fecha o modal
        if (typeof id === 'number' || String(id).length < 15) {
            setEditingService(null);
            return;
        }
        await deleteService(id);
        setEditingService(null);
    };

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-background max-w-md mx-auto overflow-hidden animate-in fade-in slide-in-from-right duration-300">
            <SettingsHeader onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-20">
                <p className="text-white/40 text-sm font-medium mb-1">Minhas</p>
                <h2 className="text-4xl font-black text-white mb-10 tracking-tight leading-none">Configurações</h2>

                {/* Seção da Empresa */}
                {isLoadingCompany ? (
                    <div className="animate-pulse bg-white/5 h-40 rounded-[32px] w-full mb-12"></div>
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

                {isLoadingCompany ? null : (
                    <BusinessHoursSection
                        isEditing={isEditingCompany} // Usamos o mesmo controle de edição da empresa
                        data={companyData}
                        isSaving={isSavingCompany}
                        onEdit={() => setIsEditingCompany(true)}
                        onSave={saveCompanyData}
                        onChange={setCompanyData}
                    />
                )}

                {/* Seção de Serviços */}
                {isLoadingServices ? (
                    <div className="animate-pulse bg-white/5 h-40 rounded-[32px] w-full"></div>
                ) : (
                    <ServicesSection
                        services={services}
                        editingId={editingService?.id}
                        onAdd={() => {
                            // Cria um item temporário. O ID curto garante que a API vai criar (POST) em vez de editar
                            setEditingService({ id: Date.now(), name: "", price: "", duration: 30 });
                        }}
                        onSelect={(service) => {
                            // Pulo do gato: Quando editamos, o preço vem como Float do banco (ex: 30.5). 
                            // Convertemos para string "3050" para a sua máscara de moeda funcionar perfeitamente no input.
                            const priceFormatted = typeof service.price === 'number'
                                ? (service.price * 100).toFixed(0)
                                : service.price;

                            setEditingService({ ...service, price: priceFormatted });
                        }}
                    />
                )}
            </div>

            <ServiceEditForm
                service={editingService}
                isOpen={!!editingService}
                onDone={handleSaveService}
                onRemove={handleDeleteService}
                onUpdate={(id: any, f: string, v: any) => {
                    // Atualiza o estado temporário enquanto o usuário digita
                    setEditingService((prev: any) => ({ ...prev, [f]: v }));
                }}
            />
        </main>
    );
};