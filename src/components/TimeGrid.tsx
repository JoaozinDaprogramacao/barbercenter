interface TimeGridProps {
  value: string;
  onChange: (time: string) => void;
}

const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export const TimeGrid = ({ value, onChange }: TimeGridProps) => (
  <div className="grid grid-cols-3 gap-2">
    {times.map((time, index) => {
      const isSelected = value === time;
      return (
        <button
          key={time}
          type="button"
          onClick={() => onChange(time)}
          // Classes de delay aplicadas sequencialmente
          className={`
            py-4 rounded-xl border transition-all duration-200 text-sm font-semibold
            active:scale-[0.96] animate-pop-in opacity-0
            ${isSelected
              ? 'bg-white text-black border-white shadow-lg'
              : 'bg-surface border-white/5 text-text-primary hover:bg-white/10'}
            ${index === 0 ? 'delay-100' : ''}
            ${index === 1 ? 'delay-150' : ''}
            ${index === 2 ? 'delay-200' : ''}
            ${index === 3 ? 'delay-250' : ''}
            ${index === 4 ? 'delay-300' : ''}
            ${index === 5 ? 'delay-350' : ''}
          `}
        >
          {time}
        </button>
      );
    })}
  </div>
);