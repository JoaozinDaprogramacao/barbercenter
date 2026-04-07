"use client";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ServiceSelectorProps {
  services: Service[];
  onSelect: (id: string, name: string) => void;
}

export const ServiceSelector = ({ services, onSelect }: ServiceSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {services.map((s, index) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id, s.name)}
          className={`
            w-full p-5 text-center rounded-2xl bg-white/5 border border-white/10 text-white text-[16px] font-bold 
            transition-all duration-300 ease-out
            hover:bg-white hover:text-black hover:border-white
            active:scale-[0.97] active:duration-100
            animate-pop-in opacity-0 fill-mode-forwards
          `}
          style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
          <div className="flex justify-between items-center px-2">
            <span>{s.name}</span>
            <span className="text-[12px] opacity-40 font-medium">
              {s.duration} min • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.price)}
            </span>
          </div>
        </button>
      ))}

      {services.length === 0 && (
        <p className="text-white/20 text-center py-4 text-sm font-medium">
          Nenhum serviço disponível no momento.
        </p>
      )}
    </div>
  );
};