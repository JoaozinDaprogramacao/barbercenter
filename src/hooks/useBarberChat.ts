import { useState, useEffect, useCallback, useMemo } from "react";

export function useBarberChat(barbershopId: string) {
    const [shopName, setShopName] = useState("Carregando...");
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState<{ time: string, duration: number }[]>([]);
    
    // 🔥 NOVO: Suportando o passo 2.5 (Upsell)
    const [step, setStep] = useState<1 | 2 | 2.5 | 3 | 4 | 5>(1); 
    
    // 🔥 NOVO: Estado para armazenar a oferta que apareceu para o cliente
    const [activeUpsell, setActiveUpsell] = useState<any>(null);
    const [isCheckingUpsell, setIsCheckingUpsell] = useState(false);

    const [userData, setUserData] = useState({
        name: "",
        selectedServices: [] as any[], // Agora os itens podem ter {id, name, price, isUpsell, discount}
        barberId: "",
        barberName: "",
        date: "",
        time: "",
        totalPrice: 0 // NOVO: Para sabermos quanto cobrar no final
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

    // 🔥 NOVO: Interceptador antes de ir para a tela de Barbeiro/Data
    const checkUpsellAndProceed = async () => {
        if (userData.selectedServices.length === 0) return;
        
        // Pega o ID do primeiro serviço escolhido para usar como Gatilho
        const mainServiceId = userData.selectedServices[0].id;
        
        setIsCheckingUpsell(true);
        try {
            // Busca se existe alguma regra ativa para esse serviço
            const res = await fetch(`/api/public/check-upsell?barbershopId=${barbershopId}&serviceId=${mainServiceId}`);
            const data = await res.json();

            if (res.ok && data.upsell) {
                // Se achou uma oferta E O CLIENTE AINDA NÃO SELECIONOU ELA NORMALMENTE, joga a isca
                const alreadySelected = userData.selectedServices.some(s => s.id === data.upsell.offerServiceId);
                
                if (!alreadySelected) {
                    setActiveUpsell(data.upsell);
                    setStep(2.5); // Vai para a tela de oferta
                    return;
                }
            }
            
            // Se não tem oferta ou já selecionou, vai direto pro Passo 3
            setStep(3);
        } catch (error) {
            console.error("Erro ao checar upsell:", error);
            setStep(3); // Falha silenciosa para não travar o cliente
        } finally {
            setIsCheckingUpsell(false);
        }
    };

    // 🔥 NOVO: Função para o cliente aceitar a oferta
    const acceptUpsellAndProceed = () => {
        if (!activeUpsell) return;

        // Encontra o serviço na lista original para pegar nome/preço real
        const serviceOferecido = availableServices.find(s => s.id === activeUpsell.offerServiceId);
        if (!serviceOferecido) return setStep(3);

        setUserData(prev => ({
            ...prev,
            selectedServices: [
                ...prev.selectedServices, 
                { 
                    id: activeUpsell.offerServiceId, 
                    name: serviceOferecido.name,
                    price: serviceOferecido.price,
                    isUpsell: true, // Tag para sabermos que teve desconto
                    discount: activeUpsell.discountAmount
                }
            ]
        }));
        
        setStep(3); // Agora sim vai pro barbeiro/horário, mas com o carrinho mais gordo!
    };
    
    const handleConfirmAppointment = async () => {
        setIsSubmitting(true);
        try {
            const selectedIds = userData.selectedServices.map((s: any) => s.id);
            
            // 🔥 Calcula o total para mandar pro banco
            const total = userData.selectedServices.reduce((acc, s) => {
                let p = s.price;
                if (s.isUpsell) {
                    p = p - (p * (s.discount / 100)); // Aplica a % de desconto
                }
                return acc + p;
            }, 0);

            await fetch('/api/public/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: userData.name,
                    serviceIds: selectedIds,
                    date: userData.date,
                    time: userData.time,
                    barbershopId,
                    barberId: userData.barberId || undefined,
                    totalPrice: total // Mandando o valor final fechado
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
        
        // Expondo a lógica do Upsell pro Visual
        checkUpsellAndProceed,
        isCheckingUpsell,
        activeUpsell,
        acceptUpsellAndProceed
    };
}