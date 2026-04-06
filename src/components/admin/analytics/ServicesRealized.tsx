"use client";

interface Service {
  name: string;
  count: number;
}

export const ServicesRealized = ({ services }: { services: Service[] }) => (
  <section className="space-y-4">
    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Serviços Realizados</p>
    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
      {services.map((service) => (
        <div key={service.name} className="min-w-[140px] bg-white/[0.03] border border-white/5 p-6 rounded-[24px] flex flex-col justify-between aspect-square">
          <span className="text-5xl font-black text-accent tracking-tighter">{service.count}</span>
          <span className="text-white/60 font-bold text-sm leading-tight">{service.name}</span>
        </div>
      ))}
    </div>
  </section>
);