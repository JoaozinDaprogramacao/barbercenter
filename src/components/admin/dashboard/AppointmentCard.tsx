interface AppointmentCardProps {
    time: string;
    name: string;
    service: string;
    price: string;
    badge?: string;
    onClick?: () => void;
}

export const AppointmentCard = ({ time, name, service, price, badge, onClick }: AppointmentCardProps) => {
    return (
        <div
            onClick={onClick}
            className="bg-surface rounded-[32px] p-6 flex flex-col gap-10 relative border border-white/5 active:scale-[0.98] transition-all cursor-pointer hover:bg-white/[0.03] group shadow-sm"
        >
            {/* LINHA SUPERIOR: HORÁRIO E AÇÕES */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-white/40 tracking-tight">{time}</span>
                    {badge && (
                        <span className="bg-success/20 text-success text-[10px] font-black px-2 py-0.5 rounded-lg border border-success/20 uppercase tracking-tighter">
                            {badge}
                        </span>
                    )}
                </div>

                <div className="flex gap-4">
                    {/* ÍCONE DE SINO / NOTIFICAÇÃO */}
                    <button className="text-white/20 group-hover:text-white/50 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                    {/* ÍCONE DE MAIS OPÇÕES (TRÊS PONTOS) */}
                    <button className="text-white/20 group-hover:text-white/50 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* LINHA INFERIOR: CLIENTE E VALOR */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h4 className="text-[22px] font-bold text-white tracking-tight leading-none">
                        {name}
                    </h4>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        {service}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-white/40 font-bold text-[12px] bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                    {/* ÍCONE DE CARTEIRA / PAGAMENTO */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h22" />
                    </svg>
                    {price}
                </div>
            </div>
        </div>
    );
};