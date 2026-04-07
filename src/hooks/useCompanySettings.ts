import { useState, useEffect } from "react";

export function useCompanySettings() {
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [companyData, setCompanyData] = useState({
        nome: "",
        endereco: "",
        telefone: "",
    });

    // 1. Busca os dados no banco assim que a tela abre
    useEffect(() => {
        fetch('/api/barbershop')
            .then(res => res.json())
            .then(data => {
                if (data.barbershop) {
                    setCompanyData({
                        nome: data.barbershop.name || "",
                        endereco: data.barbershop.address || "",
                        telefone: data.barbershop.phone || ""
                    });
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    // 2. Salva as edições no banco
    const saveCompanyData = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/barbershop', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: companyData.nome,
                    phone: companyData.telefone,
                    address: companyData.endereco
                })
            });
            setIsEditingCompany(false);
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
            // Aqui você pode plugar um Toast de erro se quiser
        } finally {
            setIsSaving(false);
        }
    };

    return {
        companyData,
        setCompanyData,
        isEditingCompany,
        setIsEditingCompany,
        isLoading,
        isSaving,
        saveCompanyData
    };
}