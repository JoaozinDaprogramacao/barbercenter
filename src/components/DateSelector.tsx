interface DateSelectorProps {
  value: string;
  onChange: (date: string) => void;
}

const dates = [
  { id: '06-abr', day: 'Seg', date: '06', month: 'Abr' },
  { id: '07-abr', day: 'Ter', date: '07', month: 'Abr' },
  { id: '08-abr', day: 'Qua', date: '08', month: 'Abr' },
];

export const DateSelector = ({ value, onChange }: DateSelectorProps) => (
  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x pt-2">
    {dates.map((item) => {
      const isActive = value === item.id;
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`
            snap-center flex-none w-[90px] py-6 rounded-2xl border transition-all duration-300
            ${isActive
              ? 'bg-white text-black border-white shadow-lg scale-105'
              // Removido o opacity-40 e text-text-secondary. Agora usa branco com 80% de opacidade para legibilidade perfeita
              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'}
          `}
        >
          {/* Opacidade aplicada apenas aos detalhes (dia da semana e mês) para dar hierarquia ao número */}
          <span className={`block text-[10px] font-bold uppercase mb-1 ${isActive ? 'opacity-60' : 'text-white/50'}`}>
            {item.day}
          </span>

          <span className={`block text-2xl font-black ${isActive ? 'text-black' : 'text-white'}`}>
            {item.date}
          </span>

          <span className={`block text-[10px] font-bold uppercase mt-1 ${isActive ? 'opacity-60' : 'text-white/50'}`}>
            {item.month}
          </span>
        </button>
      );
    })}
  </div>
);