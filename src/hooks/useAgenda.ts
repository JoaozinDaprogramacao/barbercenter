import { useState, useEffect } from "react";

export function useAgenda() {
    const [agendaData, setAgendaData] = useState<Record<string, any[]>>({});
    const [isLoadingAgenda, setIsLoadingAgenda] = useState(true);

    const fetchAgenda = async () => {
        setIsLoadingAgenda(true);
        try {
            const res = await fetch('/api/appointments');
            const data = await res.json();
            if (data.agenda) {
                setAgendaData(data.agenda);
            }
        } catch (error) {
            console.error("Erro ao carregar agenda", error);
        } finally {
            setIsLoadingAgenda(false);
        }
    };

    // Carrega a agenda assim que o hook é chamado
    useEffect(() => {
        fetchAgenda();
    }, []);

    return {
        agendaData,
        isLoadingAgenda,
        refetchAgenda: fetchAgenda // Útil para recarregar a lista depois de criar ou deletar um agendamento
    };
}