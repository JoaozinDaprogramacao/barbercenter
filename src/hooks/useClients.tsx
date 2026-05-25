import { useState, useEffect } from "react";

export interface ClientData {
    id: string;
    name: string;
    phone: string;
    totalSpent: number;
    daysSinceLastVisit: number | null;
    totalVisits: number;
}

export function useClients(barbershopId: string) {
    const [clients, setClients] = useState<ClientData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!barbershopId) return;

        const fetchClients = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/admin/clients?barbershopId=${barbershopId}`);
                if (!res.ok) throw new Error("Erro ao buscar clientes");
                
                const data = await res.json();
                setClients(data.clients);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [barbershopId]);

    return { clients, isLoading, error };
}