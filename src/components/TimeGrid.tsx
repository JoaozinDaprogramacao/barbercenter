interface TimeGridProps {
  value: string;
  onChange: (time: string) => void;
  // Agora aceita a lista de horários disponíveis como prop
  availableTimes?: string[]; 
}

export const TimeGrid = ({ value, onChange, availableTimes = [] }: TimeGridProps) => {
  
  // Caso a barbearia esteja fechada ou não haja horários
  if (availableTimes.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-center">
        <p className="text-zinc-500 text-sm">
          Não há horários disponíveis para este dia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableTimes.map((time, index) => {
        const isSelected = value === time;
        
        // Cálculo dinâmico do delay para não precisar de 500 linhas de IF
        const delay = 100 + (index * 50);

        return (
          <button
            key={time}
            type="button"
            onClick={() => onChange(time)}
            style={{ animationDelay: `${delay}ms` }}
            className={`
              py-4 rounded-xl border transition-all duration-200 text-sm font-semibold
              active:scale-[0.96] animate-in fade-in zoom-in fill-mode-forwards
              ${isSelected
                ? 'bg-white text-black border-white shadow-lg'
                : 'bg-white/5 border-white/5 text-white hover:bg-white/10'}
            `}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
};