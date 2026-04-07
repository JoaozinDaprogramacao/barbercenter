import { useState, useEffect } from "react";

export function useServices() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            if (data.services) {
                setServices(data.services);
            }
        } catch (error) {
            console.error("Erro ao carregar serviços", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Carrega a lista quando o componente monta
    useEffect(() => {
        fetchServices();
    }, []);

    const saveService = async (service: any) => {
        try {
            await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(service)
            });
            await fetchServices(); // Recarrega a lista com os dados atualizados
        } catch (error) {
            console.error("Erro ao salvar serviço", error);
        }
    };

    const deleteService = async (id: string | number) => {
        try {
            await fetch('/api/services', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            await fetchServices(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao deletar serviço", error);
        }
    };

    return { 
        services, 
        isLoading, 
        saveService, 
        deleteService 
    };
}