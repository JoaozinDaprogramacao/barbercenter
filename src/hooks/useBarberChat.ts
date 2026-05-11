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
        selectedServices: [] as any[], // Agora inclui {id, name, price, isUpsell, discount, type}
        barberId: "",
        barberName: "",
        date: "",
        time: "",
        totalPrice: 0 
    });

    // 🔥 MODIFICADO: Ignora os PRODUTOS na hora de somar o tempo da agenda!
    const totalDuration = useMemo(() => {
        if (!userData.selectedServices.length || !availableServices.length) return 30;
        
        return userData.selectedServices.reduce((total, selected) => {
            if (selected.type === 'PRODUCT') return total; // Produto custa 0 minutos!
            
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

    // 🔥 MODIFICADO: Recebe um ID para podermos fazer o LOOP de ofertas
    const checkUpsellAndProceed = async (serviceIdToCheck?: string, currentSelectedArray?: any[]) => {
        const servicesArray = currentSelectedArray || userData.selectedServices;
        if (servicesArray.length === 0) return;
        
        // Pega o ID passado ou o último serviço adicionado no carrinho
        const idToCheck = serviceIdToCheck || servicesArray[servicesArray.length - 1].id;
        
        setIsCheckingUpsell(true);
        try {
            const res = await fetch(`/api/public/check-upsell?barbershopId=${barbershopId}&serviceId=${idToCheck}`);
            const data = await res.json();

            if (res.ok && data.upsell) {
                // Impede o cliente de adicionar a mesma oferta 2x
                const alreadySelected = servicesArray.some(s => 
                    s.id === data.upsell.offerServiceId || s.id === data.upsell.offerProductId
                );
                
                if (!alreadySelected) {
                    setActiveUpsell(data.upsell);
                    setStep(2.5);
                    return;
                }
            }
            
            // Fim do funil de vendas, vai para a escolha de barbeiro
            setStep(3);
        } catch (error) {
            console.error("Erro ao checar upsell:", error);
            setStep(3); 
        } finally {
            setIsCheckingUpsell(false);
        }
    };

    // 🔥 MODIFICADO: Usa os dados diretos da API e ativa o Loop
    const acceptUpsellAndProceed = () => {
        if (!activeUpsell) return;

        const newItem = { 
            id: activeUpsell.offerType === 'PRODUCT' ? activeUpsell.offerProductId : activeUpsell.offerServiceId, 
            name: activeUpsell.offerName,
            price: activeUpsell.offerPrice,
            isUpsell: true, 
            discount: activeUpsell.discountAmount,
            type: activeUpsell.offerType // 'SERVICE' ou 'PRODUCT'
        };

        setUserData(prev => {
            const newArray = [...prev.selectedServices, newItem];
            
            // 🔥 A MÁGICA DO LOOP DE VENDAS (Ex: Corte -> Barba -> Pomada)
            // Usamos setTimeout para garantir que o state foi atualizado antes do fetch
            if (newItem.type === 'SERVICE') {
                setTimeout(() => checkUpsellAndProceed(newItem.id, newArray), 50);
            } else {
                setStep(3); // Produtos geralmente fecham o funil
            }

            return { ...prev, selectedServices: newArray };
        });
    };
    
    const handleConfirmAppointment = async () => {
        setIsSubmitting(true);
        try {
            // 🔥 MODIFICADO: Separa Serviços e Produtos para o Prisma salvar nas tabelas certas
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
                    productIds: productIds, // Novo array enviado para o backend
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