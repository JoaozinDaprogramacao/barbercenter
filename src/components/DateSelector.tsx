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
  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 snap-x">
    {dates.map((item) => {
      const isActive = value === item.id;
      return (
        <button 
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`
            snap-center flex-none w-[90px] py-6 rounded-2xl border transition-all
            ${isActive 
              ? 'bg-white text-black border-white shadow-lg' 
              : 'bg-surface border-white/5 text-text-secondary hover:border-white/20'}
          `}
        >
          <span className="block text-[10px] font-bold uppercase opacity-60 mb-1">{item.day}</span>
          <span className="block text-2xl font-black">{item.date}</span>
          <span className="block text-[10px] font-bold uppercase opacity-60 mt-1">{item.month}</span>
        </button>
      );
    })}
  </div>
);