import { useState, useEffect, useCallback, useMemo } from "react";

export function useBarberChat(barbershopId: string) {
    const [shopName, setShopName] = useState("Carregando...");
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState<{ time: string, duration: number }[]>([]);
    
    const [step, setStep] = useState<1 | 2 | 2.5 | 3 | 4 | 5>(1); 
    const [activeUpsell, setActiveUpsell] = useState<any>(null);
    const [isCheckingUpsell, setIsCheckingUpsell] = useState(false);

    const [userData, setUserData] = useState({
        name: "",
        selectedServices: [] as any[], 
        barberId: "",
        barberName: "",
        date: "",
        time: "",
        totalPrice: 0 
    });

    const totalDuration = useMemo(() => {
        if (!userData.selectedServices.length || !availableServices.length) return 30;
        
        return userData.selectedServices.reduce((total, selected) => {
            if (selected.type === 'PRODUCT') return total;
            
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

    // 🔥 LÓGICA DO LOOP CORRIGIDA
    const checkUpsellAndProceed = async (currentCart?: any[]) => {
        const cart = currentCart || userData.selectedServices;
        if (cart.length === 0) return setStep(3);
        
        const cartIds = cart.map(s => s.id).join(',');
        
        // Limpa a oferta anterior da tela para forçar uma nova animação caso ache outra
        setActiveUpsell(null);
        setIsCheckingUpsell(true);
        
        try {
            const res = await fetch(`/api/public/check-upsell?barbershopId=${barbershopId}&cartIds=${cartIds}`);
            const data = await res.json();

            if (res.ok && data.upsell) {
                // Se a API encontrou uma oferta, mostra ela.
                setActiveUpsell(data.upsell);
                setStep(2.5);
                setIsCheckingUpsell(false);
                return;
            }
            
            // Sem mais ofertas, vai pro barbeiro
            setIsCheckingUpsell(false);
            setStep(3);
        } catch (error) {
            console.error("Erro ao checar upsell:", error);
            setIsCheckingUpsell(false);
            setStep(3); 
        }
    };

    const acceptUpsellAndProceed = () => {
        if (!activeUpsell) return;

        const newItem = { 
            id: activeUpsell.offerType === 'PRODUCT' ? activeUpsell.offerProductId : activeUpsell.offerServiceId, 
            name: activeUpsell.offerName,
            price: activeUpsell.offerPrice,
            isUpsell: true, 
            discount: activeUpsell.discountAmount,
            type: activeUpsell.offerType 
        };

        // 1. Montamos o novo carrinho na memória
        const newCart = [...userData.selectedServices, newItem];
        
        // 2. Atualizamos o estado do React
        setUserData(prev => ({ ...prev, selectedServices: newCart }));

        // 3. Batemos na API de novo IMEDIATAMENTE usando o carrinho da memória, 
        // sem depender da re-renderização do React!
        checkUpsellAndProceed(newCart);
    };
    
    const handleConfirmAppointment = async () => {
        setIsSubmitting(true);
        try {
            const serviceIds = userData.selectedServices.filter((s: any) => s.type !== 'PRODUCT').map((s: any) => s.id);
            const productIds = userData.selectedServices.filter((s: any) => s.type === 'PRODUCT').map((s: any) => s.id);
            
            const total = userData.selectedServices.reduce((acc, s) => {
                let p = s.price;
                if (s.isUpsell) {
                    p = p - (p * (s.discount / 100));
                }
                return acc + p;
            }, 0);

            await fetch('/api/public/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: userData.name,
                    serviceIds: serviceIds,
                    productIds: productIds,
                    date: userData.date,
                    time: userData.time,
                    barbershopId,
                    barberId: userData.barberId || undefined,
                    totalPrice: total
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
        bookedAppointments,
        
        checkUpsellAndProceed,
        isCheckingUpsell,
        activeUpsell,
        acceptUpsellAndProceed
    };
}