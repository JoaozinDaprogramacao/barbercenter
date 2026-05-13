export const getAvailableTimesForDate = (
  selectedDate: string,
  businessHours: any,
  appointments: { time: string; duration: number; barberId?: string }[] = [],
  totalServiceDuration: number = 30,
  team: any[] = [],               // Lista com todos os profissionais da loja
  selectedBarberId: string = ""   // ID do profissional escolhido (vazio se for "Qualquer")
) => {
  if (!businessHours || !selectedDate) return [];

  const monthMap: any = {
    jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
    jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
  };

  const parts = selectedDate.split("-");
  const now = new Date();

  const dateObj = new Date(
    now.getFullYear(),
    monthMap[parts[1].toLowerCase()],
    parseInt(parts[0], 10)
  );

  const dayConfig = businessHours[dateObj.getDay()];
  if (!dayConfig || !dayConfig.isOpen) return [];

  const slots = [];
  let [h, m] = dayConfig.openTime.split(":").map(Number);
  const [eh, em] = dayConfig.closeTime.split(":").map(Number);

  let current = h * 60 + m;
  const end = eh * 60 + em;

  // 👇 NOVO: Pega o horário de almoço e converte para minutos (se existir)
  let lunchStartMins = -1;
  let lunchEndMins = -1;
  if (dayConfig.lunchStart && dayConfig.lunchEnd) {
    const [lh, lm] = dayConfig.lunchStart.split(":").map(Number);
    const [leh, lem] = dayConfig.lunchEnd.split(":").map(Number);
    lunchStartMins = lh * 60 + lm;
    lunchEndMins = leh * 60 + lem;
  }

  const isToday =
    dateObj.getDate() === now.getDate() &&
    dateObj.getMonth() === now.getMonth() &&
    dateObj.getFullYear() === now.getFullYear();

  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  const bookedRanges = appointments.map((app) => {
    const [appH, appM] = app.time.split(":").map(Number);
    const start = appH * 60 + appM;
    return { start, end: start + app.duration, barberId: app.barberId };
  });

  while (current < end) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    const proposedEnd = current + totalServiceDuration;

    let isAvailable = false;

    // 👇 NOVO: Lógica que checa se o serviço invade o horário de almoço
    const isDuringLunch = lunchStartMins !== -1 && lunchEndMins !== -1 &&
                          (current < lunchEndMins && proposedEnd > lunchStartMins);

    // Adicionamos a regra !isDuringLunch aqui:
    if (!(isToday && current <= currentTotalMinutes) && proposedEnd <= end && !isDuringLunch) {
      
      const barbersToCheck = selectedBarberId ? [{ id: selectedBarberId }] : team;

      for (const barber of barbersToCheck) {
        const barberAppointments = bookedRanges.filter(app => app.barberId === barber.id);
        let barberIsFree = true;

        for (const range of barberAppointments) {
          if (current < range.end && proposedEnd > range.start) {
            barberIsFree = false; 
            break;
          }
        }

        if (barberIsFree) {
          isAvailable = true; 
          break; 
        }
      }
    }

    if (isAvailable) {
      slots.push(timeString);
    }

    current += 30;
  }

  return slots;
};