"use client";
import { useState } from "react";
import { SettingsHeader } from "./SettingsHeader";
import { CompanySection } from "./CompanySection";
import { ServicesSection } from "./ServicesSection";
import { ServiceEditForm } from "./ServiceEditForm";

export const SettingsView = ({ onBack }: { onBack: () => void }) => {
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [companyData, setCompanyData] = useState({
        name: "InBarber", address: "Rua Padre Manuel da Nóbrega, 424 - B4 804", city: "Fanny - Curitiba / Paraná", phone: "+55 (41) 98518-8245",
    });
    const [services, setServices] = useState([{ id: 1, name: "Corte", price: "30,00" }, { id: 2, name: "Barba", price: "20,00" }, { id: 3, name: "Corte degrade", price: "30,00" }]);
    const [editingService, setEditingService] = useState<any>(null);

    return (
        <main className="h-[100dvh] w-full flex flex-col bg-background max-w-md mx-auto overflow-hidden animate-in fade-in slide-in-from-right duration-300">
            <SettingsHeader onBack={onBack} />
            <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-20">
                <p className="text-white/40 text-sm font-medium mb-1">Minhas</p>
                <h2 className="text-4xl font-black text-white mb-10 tracking-tight leading-none">Configurações</h2>
                
                <CompanySection 
                  isEditing={isEditingCompany} data={companyData} 
                  onEdit={() => setIsEditingCompany(true)} onSave={() => setIsEditingCompany(false)}
                  onChange={setCompanyData} 
                />

                <ServicesSection 
                  services={services} editingId={editingService?.id}
                  onAdd={() => { const ns = { id: Date.now(), name: "Novo", price: "0,00" }; setServices([...services, ns]); setEditingService(ns); }}
                  onSelect={setEditingService}
                />

                {editingService && (
                  <ServiceEditForm 
                    service={editingService} onDone={() => setEditingService(null)}
                    onRemove={(id: number) => { setServices(services.filter(s => s.id !== id)); setEditingService(null); }}
                    onUpdate={(id: number, f: string, v: string) => {
                      setServices(services.map(s => s.id === id ? { ...s, [f]: v } : s));
                      setEditingService((prev: any) => ({ ...prev, [f]: v }));
                    }}
                  />
                )}
            </div>
        </main>
    );
};