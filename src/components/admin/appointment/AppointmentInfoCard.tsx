"use client";

interface AppointmentInfoCardProps {
  data: any;
  onEditDate: () => void;
  onEditServices: () => void;
  onWhatsApp: () => void;
}

export const AppointmentInfoCard = ({ data, onEditDate, onEditServices, onWhatsApp }: AppointmentInfoCardProps) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
    {/* DATA E HORA */}
    <div className="p-6 border-b border-white/5 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-white">{data.date}</h3>
        <p className="text-accent font-bold text-sm uppercase tracking-wider">{data.time}</p>
      </div>
      <button onClick={onEditDate} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 active:scale-95 transition-all">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
    </div>

    {/* CLIENTE */}
    <div className="p-6 border-b border-white/5">
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Cliente</p>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-white leading-none mb-2">{data.client.name}</h3>
          <p className="text-white/40 font-medium tracking-wide">+55 (41) 99666-4344</p>
        </div>
        <button onClick={onWhatsApp} className="w-14 h-14 bg-accent rounded-[20px] flex items-center justify-center text-2xl shadow-lg shadow-accent/20 active:scale-90 transition-all">
          💬
        </button>
      </div>
    </div>

    {/* SERVIÇOS */}
    <div className="p-6 border-b border-white/5">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Serviços</p>
        <button onClick={onEditServices} className="text-[10px] font-black text-accent uppercase tracking-widest">ALTERAR</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.services.map((s: any) => (
          <div key={s.id} className="bg-white/5 px-4 py-2 rounded-xl text-white/80 font-bold text-xs border border-white/5">
            {s.name}
          </div>
        ))}
      </div>
    </div>

    {/* FINANCEIRO */}
    <div className="p-6 bg-white/[0.02] flex justify-between items-end">
      <div>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Total a receber</p>
        <h4 className="text-3xl font-black text-white">R$ {data.total.toFixed(2).replace('.',',')}</h4>
        <p className="text-accent/60 text-xs font-bold uppercase tracking-widest mt-1">{data.paymentMethod}</p>
      </div>
      <div className="bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
         <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Confirmado</p>
      </div>
    </div>
  </div>
);