import { useState, useEffect, useCallback } from "react";

export function useBarberChat(barbershopId: string) {
    const [shopName, setShopName] = useState("Carregando...");
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [businessHours, setBusinessHours] = useState<any>(null);
    // 👇 NOVO: Estado para guardar os barbeiros da loja
    const [team, setTeam] = useState<any[]>([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 👇 ALTERADO: Agora vamos até o passo 5
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); 
    
    const [userData, setUserData] = useState({
        name: "",
        selectedServices: [] as any[],
        barberId: "",   // <-- Guarda o ID do profissional escolhido
        barberName: "", // <-- Guarda o nome para mostrar no balão do chat
        date: "",
        time: "",
    });

    useEffect(() => {
        if (!barbershopId) return;
        fetch(`/api/public/barbershop/${barbershopId}`)
            .then(res => res.json())
            .then(data => {
                setShopName(data.name);
                setAvailableServices(data.services || []);
                setBusinessHours(data.businessHours);
                // 👇 NOVO: Puxa os barbeiros que colocamos na rota pública
                setTeam(data.users || []); 
            });
    }, [barbershopId]);

    const handleNextStep = useCallback((name: string) => {
        setUserData(prev => ({ ...prev, name }));
        setStep(2);
    }, []);
    
    const handleConfirmAppointment = async () => {
        setIsSubmitting(true);
        try {
            const selectedIds = userData.selectedServices.map((s: any) => s.id);

            await fetch('/api/public/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: userData.name,
                    serviceIds: selectedIds,
                    date: userData.date,
                    time: userData.time,
                    barbershopId,
                    // 👇 NOVO: Envia o ID do barbeiro (Se for vazio "", o backend trata)
                    barberId: userData.barberId || undefined 
                })
            });
            // 👇 ALTERADO: Sucesso agora é o passo 5
            setStep(5); 
        } catch (error) {
            alert("Erro ao agendar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        shopName,
        availableServices,
        businessHours,
        team, // <-- Exportamos a equipe
        isSubmitting,
        step,
        setStep,
        userData,
        setUserData,
        handleConfirmAppointment
    };
}