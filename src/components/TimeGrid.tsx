interface TimeGridProps {
  value: string;
  onChange: (time: string) => void;
}

const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export const TimeGrid = ({ value, onChange }: TimeGridProps) => (
  <div className="grid grid-cols-3 gap-2">
    {times.map((time) => {
      const isSelected = value === time;
      return (
        <button 
          key={time}
          type="button"
          onClick={() => onChange(time)}
          className={`
            py-4 rounded-xl border transition-all text-sm font-semibold
            ${isSelected 
              ? 'bg-white text-black border-white shadow-lg' 
              : 'bg-surface border-white/5 text-text-primary hover:bg-white/10'}
          `}
        >
          {time}
        </button>
      );
    })}
  </div>
);