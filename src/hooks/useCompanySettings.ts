import { useState, useEffect } from "react";

// Horários padrão para uma nova barbearia
const DEFAULT_HOURS = [
    { day: 0, label: "Domingo", isOpen: false, openTime: "09:00", closeTime: "13:00" },
    { day: 1, label: "Segunda", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: 2, label: "Terça", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: 3, label: "Quarta", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: 4, label: "Quinta", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: 5, label: "Sexta", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { day: 6, label: "Sábado", isOpen: true, openTime: "08:00", closeTime: "17:00" },
];

export function useCompanySettings() {
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [companyData, setCompanyData] = useState({
        nome: "",
        endereco: "",
        telefone: "",
        businessHours: DEFAULT_HOURS
    });

    useEffect(() => {
        fetch('/api/barbershop')
            .then(res => res.json())
            .then(data => {
                if (data.barbershop) {
                    setCompanyData({
                        nome: data.barbershop.name || "",
                        endereco: data.barbershop.address || "",
                        telefone: data.barbershop.phone || "",
                        // Se existir no banco, usa. Se não, usa o DEFAULT
                        businessHours: data.barbershop.businessHours || DEFAULT_HOURS
                    });
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const saveCompanyData = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/barbershop', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: companyData.nome,
                    phone: companyData.telefone,
                    address: companyData.endereco,
                    businessHours: companyData.businessHours // Manda pra API
                })
            });
            setIsEditingCompany(false);
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        companyData, setCompanyData,
        isEditingCompany, setIsEditingCompany,
        isLoading, isSaving, saveCompanyData
    };
}