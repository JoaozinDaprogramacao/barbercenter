export const ServiceSelector = ({ onSelect }: { onSelect: (s: string) => void }) => {
  const services = ["Corte Masculino", "Barba", "Combo"];
  
  return (
    <div className="grid grid-cols-1 gap-3">
      {services.map((s, index) => (
        <button 
          key={s}
          onClick={() => onSelect(s)}
          // 1. Animação pop-in personalizada
          // 2. Classes delay-X para efeito sequencial (stagger) baseadas no index
          // 3. active:scale-97 para feedback tátil ao toque
          className={`
            w-full p-5 text-center rounded-2xl bg-white/5 border border-white/10 text-white text-[16px] font-bold 
            transition-all duration-300 ease-out
            hover:bg-white hover:text-black hover:border-white
            active:scale-[0.97] active:duration-100
            animate-pop-in opacity-0
            ${index === 0 ? 'delay-100' : ''}
            ${index === 1 ? 'delay-200' : ''}
            ${index === 2 ? 'delay-300' : ''}
          `}
        >
          {s}
        </button>
      ))}
    </div>
  );
};