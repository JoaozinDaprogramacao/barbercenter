import { useState, useEffect, useCallback } from "react";

export function useAppointmentManager(appointmentId: string) {
    const [appointment, setAppointment] = useState<any>(null);
    const [businessHours, setBusinessHours] = useState<any>(null);
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!appointmentId) return;
            setIsLoading(true);
            try {
                const res = await fetch(`/api/appointments/${appointmentId}`);
                if (!res.ok) throw new Error("Não encontrado");
                const data = await res.json();

                setAppointment(data);

                if (data?.barbershopId) {
                    const shopRes = await fetch(`/api/public/barbershop/${data.barbershopId}`);
                    if (shopRes.ok) {
                        const shopData = await shopRes.json();
                        setBusinessHours(shopData.businessHours);
                        setAvailableServices(shopData.services || []);
                    }
                }
            } catch (e) {
                console.error("Erro no fetch:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [appointmentId]);

    const getAvailableTimes = useCallback((date: string) => {
        if (!businessHours || !date) return [];
        const monthMap: Record<string, number> = { "jan": 0, "fev": 1, "mar": 2, "abr": 3, "mai": 4, "jun": 5, "jul": 6, "ago": 7, "set": 8, "out": 9, "nov": 10, "dez": 11 };
        const parts = date.split("-");
        const day = parseInt(parts[0], 10);
        const dayOfWeek = new Date(new Date().getFullYear(), monthMap[parts[1].toLowerCase()], day).getDay();
        const dayConfig = businessHours[dayOfWeek];

        if (!dayConfig || !dayConfig.isOpen) return [];

        const slots = [];
        let [h, m] = dayConfig.openTime.split(":").map(Number);
        const [eh, em] = dayConfig.closeTime.split(":").map(Number);
        let current = h * 60 + m;
        const end = eh * 60 + em;

        while (current < end) {
            slots.push(`${Math.floor(current / 60).toString().padStart(2, "0")}:${(current % 60).toString().padStart(2, "0")}`);
            current += 30;
        }
        return slots;
    }, [businessHours]);

    const updateDateTime = async (date: string, time: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, time })
            });
            if (res.ok) setAppointment((prev: any) => ({ ...prev, date, dateLabel: date, time }));
            return res.ok;
        } catch (error) {
            alert("Erro ao atualizar data/hora.");
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    // ATUALIZADO: Agora recebe um array de IDs (múltiplos serviços)
    const updateServices = async (serviceIds: string[]) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceIds })
            });
            if (res.ok) {
                const updatedAppt = await res.json();
                // Atualiza o estado local com os novos dados vindos do banco
                setAppointment((prev: any) => ({ 
                    ...prev, 
                    services: updatedAppt.services,
                    price: updatedAppt.services.reduce((acc: number, s: any) => acc + s.price, 0),
                    service: updatedAppt.services.map((s: any) => s.name).join(", ")
                }));
            }
            return res.ok;
        } catch (error) {
            alert("Erro ao atualizar serviços.");
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    const cancelAppointment = async () => {
        try {
            const res = await fetch(`/api/appointments/${appointmentId}`, { method: 'DELETE' });
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return {
        appointment, isLoading, isUpdating, availableServices, 
        getAvailableTimes, updateDateTime, updateServices, cancelAppointment
    };
}