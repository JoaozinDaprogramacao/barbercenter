const services = [
  { id: 1, name: "Corte Masculino", price: "R$ 50", time: "45 min", icon: "✂️" },
  { id: 2, name: "Barba Terapia", price: "R$ 40", time: "30 min", icon: "🪒" },
  { id: 3, name: "Combo (Corte + Barba)", price: "R$ 80", time: "1h 15min", icon: "🔥" },
];

export const ServiceSelector = ({ onSelect }: { onSelect: (name: string) => void }) => (
  <div className="grid grid-cols-1 gap-3">
    {services.map((s) => (
      <button 
        key={s.id}
        onClick={() => onSelect(s.name)}
        className="group flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{s.icon}</span>
          <div className="text-left">
            <p className="font-bold text-lg leading-tight">{s.name}</p>
            <p className="text-xs opacity-60 group-hover:text-black/60">{s.time}</p>
          </div>
        </div>
        <span className="font-black text-lg">{s.price}</span>
      </button>
    ))}
  </div>
);