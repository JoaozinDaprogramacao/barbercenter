export const ServiceSelector = ({ onSelect }: { onSelect: (s: string) => void }) => (
  <div className="grid grid-cols-1 gap-3">
    {["Corte Masculino", "Barba", "Combo"].map((s) => (
      <button 
        key={s}
        onClick={() => onSelect(s)}
        className="w-full p-5 text-center rounded-2xl bg-white/5 border border-white/10 text-white text-[16px] font-bold active:bg-white active:text-black transition-all"
      >
        {s}
      </button>
    ))}
  </div>
);