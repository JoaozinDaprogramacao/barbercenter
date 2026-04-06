const dates = [
  { day: 'Seg', date: '06', month: 'Abr' },
  { day: 'Ter', date: '07', month: 'Abr', active: true },
  { day: 'Qua', date: '08', month: 'Abr' },
];

export const DateSelector = () => (
  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 snap-x">
    {dates.map((item, i) => (
      <button 
        key={i}
        className={`
          snap-center flex-none w-[90px] py-6 rounded-2xl border transition-all
          ${item.active 
            ? 'bg-white text-black border-white shadow-lg shadow-white/5' 
            : 'bg-surface border-white/5 text-text-secondary hover:border-white/20'}
        `}
      >
        <span className="block text-[10px] font-bold uppercase opacity-60 mb-1">{item.day}</span>
        <span className="block text-2xl font-black">{item.date}</span>
        <span className="block text-[10px] font-bold uppercase opacity-60 mt-1">{item.month}</span>
      </button>
    ))}
  </div>
);