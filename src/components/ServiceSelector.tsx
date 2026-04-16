"use client";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedIds: string[]; // Nova prop para saber o que está marcado
  onSelect: (id: string, name: string) => void;
}

export const ServiceSelector = ({ services, onSelect, selectedIds }: ServiceSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {services.map((s, index) => {
        const isSelected = selectedIds.includes(s.id); // Verifica se este serviço está na lista

        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id, s.name)}
            className={`
              w-full p-5 text-center rounded-2xl border transition-all duration-300 ease-out
              active:scale-[0.97] active:duration-100
              animate-pop-in opacity-0 fill-mode-forwards
              ${isSelected 
                ? "bg-orange-600 border-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]" 
                : "bg-white/5 border-white/10 text-white hover:bg-white/10"}
            `}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className="flex justify-between items-center px-2">
              <span className="font-bold text-[16px]">{s.name}</span>
              <span className={`text-[12px] font-medium transition-opacity ${isSelected ? "opacity-100" : "opacity-40"}`}>
                {s.duration} min • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.price)}
              </span>
            </div>
          </button>
        );
      })}

      {services.length === 0 && (
        <p className="text-white/20 text-center py-4 text-sm font-medium">
          Nenhum serviço disponível no momento.
        </p>
      )}
    </div>
  );
};