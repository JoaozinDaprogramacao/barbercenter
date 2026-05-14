// hooks/useAdminAgendar.ts
import { useState, useEffect, useMemo } from "react";
import { getAvailableTimesForDate } from "@/lib/date-utils";

export function useAdminAgendar(barbershopId: string) {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [businessHours, setBusinessHours] = useState<any>(null);
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);

  const [clientName, setClientName] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (!barbershopId) return;
    fetch(`/api/public/barbershop/${barbershopId}`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services || []);
        setProducts(data.products || []);
        setTeam(data.users || []);
        setBusinessHours(data.businessHours || null);
        if (data.users?.length > 0) setSelectedBarber(data.users[0].id);
        setIsLoadingData(false);
      });
  }, [barbershopId]);

  useEffect(() => {
    if (!selectedDate || !barbershopId) return;
    const params = new URLSearchParams({ date: selectedDate, barbershopId });
    if (selectedBarber) params.append("barberId", selectedBarber);

    fetch(`/api/public/appointments?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setBookedAppointments(Array.isArray(data.appointments) ? data.appointments : []);
      });
  }, [selectedDate, selectedBarber, barbershopId]);

  const totalDuration = useMemo(() => {
    let total = 0;
    selectedServices.forEach((id) => {
      const service = services.find((s) => s.id === id);
      if (service?.duration) total += Number(service.duration); // Corrigido para Number
    });
    return total || 30;
  }, [selectedServices, services]);

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedServices.forEach((id) => {
      const s = services.find((item) => item.id === id);
      if (s) total += Number(s.price || 0);
    });
    selectedProducts.forEach((id) => {
      const p = products.find((item) => item.id === id);
      if (p) total += Number(p.price || 0);
    });
    return total;
  }, [selectedServices, selectedProducts, services, products]);

  const availableTimes = useMemo(() => {
    if (!selectedDate || !businessHours) return [];
    return getAvailableTimesForDate(selectedDate, businessHours, bookedAppointments, totalDuration, team, selectedBarber);
  }, [selectedDate, businessHours, bookedAppointments, totalDuration, team, selectedBarber]);

  return {
    state: { isLoadingData, isSubmitting, services, products, team, clientName, selectedServices, selectedProducts, selectedBarber, selectedDate, selectedTime, totalDuration, totalPrice, availableTimes },
    actions: { setClientName, setSelectedServices, setSelectedProducts, setSelectedBarber, setSelectedDate, setSelectedTime, setIsSubmitting }
  };
}