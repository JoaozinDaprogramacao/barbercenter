interface Service { id: number; name: string; price: string; }

interface ServicesSectionProps {
  services: Service[];
  editingId?: number;
  onAdd: () => void;
  onSelect: (s: Service) => void;
}

export const ServicesSection = ({ services, editingId, onAdd, onSelect }: ServicesSectionProps) => (
  <section className="animate-in fade-in delay-150 duration-500">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Serviços</h3>
    </div>
    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x pb-4">
      <button onClick={onAdd} className="snap-center flex-none w-[65px] h-[160px] rounded-[32px] bg-white/[0.03] border border-dashed border-white/20 flex items-center justify-center text-white active:scale-95">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </div>
      </button>

      {services.map((s) => (
        <div 
          key={s.id} 
          onClick={() => onSelect(s)}
          className={`snap-center flex-none w-[160px] rounded-[32px] p-6 border relative transition-all active:scale-[0.98] ${
            editingId === s.id ? 'bg-accent border-accent' : 'bg-surface border-white/5'
          }`}
        >
          <div className={`w-10 h-1.5 rounded-full mb-12 ${editingId === s.id ? 'bg-white/40' : 'bg-accent/30'}`}></div>
          <h5 className="text-white font-bold text-lg leading-tight">{s.name}</h5>
          <p className={`text-[14px] font-bold mt-1 ${editingId === s.id ? 'text-white/80' : 'text-white/40'}`}>R$ {s.price}</p>
        </div>
      ))}
    </div>
  </section>
);