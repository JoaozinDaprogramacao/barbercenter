"use client";
import { useState } from "react";
import { SettingsHeader } from "./SettingsHeader";
import { CompanySection } from "./CompanySection";
import { ServicesSection } from "./ServicesSection";
import { ServiceEditForm } from "./ServiceEditForm";
import { useCompanySettings } from "@/hooks/useCompanySettings"; // Importe o hook

export const SettingsView = ({ onBack }: { onBack: () => void }) => {
    // Puxando tudo do nosso Hook
    const { 
        companyData, setCompanyData, 
        isEditingCompany, setIsEditingCompany, 
        isLoading, isSaving, saveCompanyData 
    } = useCompanySettings();

    // Mock temporário dos serviços (depois faremos um Hook igual para eles)
    const [services, setServices] = useState([{ id: 1, name: "Corte", price: "30,00" }]);
    const [editingService, setEditingService] = useState<any>(null);

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-background max-w-md mx-auto overflow-hidden animate-in fade-in slide-in-from-right duration-300">
            <SettingsHeader onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-20">
                <p className="text-white/40 text-sm font-medium mb-1">Minhas</p>
                <h2 className="text-4xl font-black text-white mb-10 tracking-tight leading-none">Configurações</h2>

                {isLoading ? (
                    <div className="animate-pulse bg-white/5 h-40 rounded-[32px] w-full mb-12"></div>
                ) : (
                    <CompanySection
                        isEditing={isEditingCompany} 
                        data={companyData}
                        isSaving={isSaving} // Passando estado de salvamento
                        onEdit={() => setIsEditingCompany(true)} 
                        onSave={saveCompanyData} // Chama a função de salvar do Hook
                        onChange={setCompanyData}
                    />
                )}

                <ServicesSection
                    services={services} editingId={editingService?.id}
                    onAdd={() => {
                        const ns = { id: Date.now(), name: "", price: "" };
                        setServices([...services, ns]);
                        setEditingService(ns);
                    }}
                    onSelect={setEditingService}
                />
            </div>

            <ServiceEditForm
                service={editingService}
                isOpen={!!editingService}
                onDone={() => setEditingService(null)}
                onRemove={(id: number) => {
                    setServices(services.filter(s => s.id !== id));
                    setEditingService(null);
                }}
                onUpdate={(id: number, f: string, v: string) => {
                    setServices(services.map(s => s.id === id ? { ...s, [f]: v } : s));
                    setEditingService((prev: any) => ({ ...prev, [f]: v }));
                }}
            />
        </main>
    );
};