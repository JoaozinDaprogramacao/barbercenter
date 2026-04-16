export const getAvailableTimesForDate = (selectedDate: string, businessHours: any) => {
  if (!businessHours || !selectedDate) return [];
  
  const monthMap: any = { 
    jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5, 
    jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11 
  };
  
  const parts = selectedDate.split("-");
  const dateObj = new Date(
    new Date().getFullYear(), 
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

  while (current < end) {
    slots.push(
      `${Math.floor(current / 60).toString().padStart(2, "0")}:${(current % 60)
        .toString()
        .padStart(2, "0")}`
    );
    current += 30;
  }
  return slots;
};