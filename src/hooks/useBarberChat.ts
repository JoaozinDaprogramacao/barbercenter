import { useState, useEffect, useCallback, useRef } from "react";

export function useBarberChat(barbershopId: string) {
    const [shopName, setShopName] = useState("Carregando...");
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [userData, setUserData] = useState({
        name: "", serviceId: "", serviceName: "", date: "", time: "",
    });

    // Fetch inicial dos dados da barbearia
    useEffect(() => {
        if (!barbershopId) return;
        fetch(`/api/public/barbershop/${barbershopId}`)
            .then(res => res.json())
            .then(data => {
                setShopName(data.name);
                setAvailableServices(data.services || []);
                setBusinessHours(data.businessHours);
            });
    }, [barbershopId]);

    const handleNextStep = useCallback((name: string) => {
        setUserData(prev => ({ ...prev, name }));
        setStep(2);
    }, []);

    const handleConfirmAppointment = async () => {
        setIsSubmitting(true);
        try {
            await fetch('/api/public/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, barbershopId })
            });
            setStep(4);
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
        isSubmitting,
        step,
        setStep,
        userData,
        setUserData,
        handleConfirmAppointment
    };
}