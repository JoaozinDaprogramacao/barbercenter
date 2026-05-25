import { useState, useEffect, useCallback, useMemo } from "react";

export function useBarberChat(barbershopId: string) {
    const [shopName, setShopName] = useState("Carregando...");
    const [activeDownsell, setActiveDownsell] = useState<any>(null);
    const [isCheckingDownsell, setIsCheckingDownsell] = useState(false);
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState<{ time: string, duration: number }[]>([]);

    const [step, setStep] = useState<1 | 1.5 | 2 | 2.5 | 2.7 | 3 | 4 | 5>(1);
    const [activeUpsell, setActiveUpsell] = useState<any>(null);
    const [isCheckingUpsell, setIsCheckingUpsell] = useState(false);

    // Adicione 'phone: ""' no userData
    const [userData, setUserData] = useState({
        name: "",
        phone: "",
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
                setAvailableProducts(data.products || []);
                setBusinessHours(data.businessHours);
                setTeam(data.users || []);
            });
    }, [barbershopId]);

    const handleNextStep = useCallback((name: string) => {
        setUserData(prev => ({ ...prev, name }));
        setStep(2);
    }, []);

    const checkUpsellAndProceed = async (currentCart?: any[]) => {
        const cart = currentCart || userData.selectedServices;
        if (cart.length === 0) return setStep(3);

        const cartIds = cart.map(s => s.id).join(',');

        setActiveUpsell(null);
        setIsCheckingUpsell(true);

        try {
            await new Promise(r => setTimeout(r, 1000));

            const res = await fetch(`/api/public/check-upsell?barbershopId=${barbershopId}&cartIds=${cartIds}`);
            const data = await res.json();

            if (res.ok && data.upsell) {
                setActiveUpsell(data.upsell);
                setStep(2.5);
                setIsCheckingUpsell(false);
                return;
            }

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

        const newCart = [...userData.selectedServices, newItem];
        setUserData(prev => ({ ...prev, selectedServices: newCart }));
        checkUpsellAndProceed(newCart);
    };

    const handleDeclineUpsell = () => {
        // 1. Verifica se a regra de upsell atual TEM um downsell configurado nela mesma
        if (!activeUpsell || !activeUpsell.hasDownsell) {
            return setStep(3);
        }

        setIsCheckingDownsell(true);
        setStep(2.7);

        // 2. Como os dados do downsell já vieram da API junto com o Upsell, 
        // não precisamos fazer outro fetch! Só precisamos montar o objeto.
        setTimeout(() => {
            const isProduct = !!activeUpsell.downsellOfferProductId;
            const offerId = isProduct ? activeUpsell.downsellOfferProductId : activeUpsell.downsellOfferServiceId;

            const linkedItem = isProduct
                ? availableProducts.find(p => p.id === offerId)
                : availableServices.find(s => s.id === offerId);

            setActiveDownsell({
                id: activeUpsell.id,
                offerType: isProduct ? 'PRODUCT' : 'SERVICE',
                productId: activeUpsell.downsellOfferProductId,
                serviceId: activeUpsell.downsellOfferServiceId,
                offerName: linkedItem?.name || "Oferta Especial",
                originalPrice: linkedItem?.price,
                discountAmount: activeUpsell.downsellDiscountAmount,
                discountType: activeUpsell.discountType || 'PERCENTAGE', // Usa a mesma unidade da regra base
                downsellCustomCopy: activeUpsell.downsellCustomCopy
            });

            setIsCheckingDownsell(false);
        }, 600); // Um leve delay apenas para a animação da bolha fluir bem
    };

    const acceptDownsellAndProceed = () => {
        if (!activeDownsell) return;

        const newItem = {
            id: activeDownsell.offerType === 'PRODUCT' ? activeDownsell.productId : activeDownsell.serviceId,
            name: activeDownsell.offerName,
            price: activeDownsell.originalPrice,
            isUpsell: true,
            discount: activeDownsell.discountAmount,
            type: activeDownsell.offerType
        };

        const newCart = [...userData.selectedServices, newItem];
        setUserData(prev => ({ ...prev, selectedServices: newCart }));
        setStep(3);
    };



    const declineDownsellAndProceed = () => {
        setStep(3);
    };

    const handleConfirmAppointment = async () => {
        setIsSubmitting(true);
        try {
            const serviceIds = userData.selectedServices.filter((s: any) => s.type !== 'PRODUCT').map((s: any) => s.id);
            const productIds = userData.selectedServices.filter((s: any) => s.type === 'PRODUCT').map((s: any) => s.id);

            const total = userData.selectedServices.reduce((acc, s) => {
                let basePrice = Number(s.price);

                if (isNaN(basePrice) || basePrice === undefined) {
                    const originalService = availableServices.find(cat => cat.id === s.id);
                    const originalProduct = availableProducts.find(cat => cat.id === s.id);
                    basePrice = Number(originalService?.price) || Number(originalProduct?.price) || 0;
                }

                if (s.isUpsell) {
                    const discountVal = Number(s.discount) || 0;
                    basePrice = basePrice - (basePrice * (discountVal / 100));
                }

                return acc + basePrice;
            }, 0);

            await fetch('/api/public/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: userData.name,
                    phone: userData.phone, // <--- ADICIONE ESTA LINHA
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
        availableProducts,
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
        acceptUpsellAndProceed,
        handleDeclineUpsell,
        activeDownsell,
        isCheckingDownsell,
        acceptDownsellAndProceed,
        declineDownsellAndProceed
    };
}