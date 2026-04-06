const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export const TimeGrid = () => (
  <div className="grid grid-cols-3 gap-2">
    {times.map((time) => (
      <button 
        key={time}
        className="py-4 rounded-xl border border-white/5 bg-surface text-sm font-semibold hover:bg-white/10 hover:border-white/20 active:bg-white text-text-primary active:text-black transition-all"
      >
        {time}
      </button>
    ))}
  </div>
);