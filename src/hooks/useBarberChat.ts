import { useState, useEffect, useCallback, useMemo } from "react";

export function useBarberChat(barbershopId: string) {
    const [shopName, setShopName] = useState("Carregando...");
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState<{ time: string, duration: number }[]>([]);
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); 
    
    const [userData, setUserData] = useState({
        name: "",
        selectedServices: [] as any[],
        barberId: "",
        barberName: "",
        date: "",
        time: "",
    });

    const totalDuration = useMemo(() => {
        if (!userData.selectedServices.length || !availableServices.length) return 30;
        
        return userData.selectedServices.reduce((total, selected) => {
            const service = availableServices.find(s => s.id === selected.id);
            return total + (service?.duration || 0);
        }, 0);
    }, [userData.selectedServices, availableServices]);

    useEffect(() => {
        if (!userData.date || !barbershopId) return;

        setBookedAppointments([]);

        const params = new URLSearchParams({
            date: userData.date,
            barbershopId: barbershopId
        });
        
        if (userData.barberId) params.append("barberId", userData.barberId);

        fetch(`/api/public/appointments?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data.appointments) {
                    setBookedAppointments(data.appointments);
                }
            })
            .catch(err => console.error("Erro ao buscar horários", err));
    }, [userData.date, userData.barberId, barbershopId]);

    useEffect(() => {
        if (!barbershopId) return;
        
        fetch(`/api/public/barbershop/${barbershopId}`)
            .then(res => res.json())
            .then(data => {
                setShopName(data.name);
                setAvailableServices(data.services || []);
                setBusinessHours(data.businessHours);
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
                    barberId: userData.barberId || undefined 
                })
            });
            
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
        team,
        isSubmitting,
        step,
        setStep,
        userData,
        setUserData,
        handleConfirmAppointment,
        totalDuration,
        bookedAppointments
    };
}