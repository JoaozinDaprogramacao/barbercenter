interface SummaryCardsProps {
    showValues: boolean;
    todayRevenue: string;
    todayCount: number;
    weekRevenue: string;
    weekCount: number;
}

export const SummaryCards = ({ showValues, todayRevenue, todayCount, weekRevenue, weekCount }: SummaryCardsProps) => {
    return (
        <div className="px-6 flex gap-4 mb-8">
            {/* CARD HOJE (COBRE / ACCENT) */}
            <div className="flex-1 bg-gradient-to-br from-accent to-accent-light rounded-[32px] p-5 shadow-[0_20px_40px_rgba(178,123,92,0.2)] relative overflow-hidden transition-all active:scale-[0.98]">
                <h3 className="text-white/80 font-bold text-sm uppercase tracking-wider">Hoje</h3>

                <div className="flex items-center gap-1.5 text-white font-bold mt-1 text-base">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    {showValues ? todayRevenue : "R$ •••••"}
                </div>

                <div className="text-[54px] font-black leading-none mt-4 text-white tracking-tighter">
                    {todayCount}
                </div>

                {/* ÍCONE DE FUNDO ESTILIZADO (IGUAL A FOTO) */}
                <div className="absolute -bottom-2 -right-2 text-white/10 rotate-12">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    </svg>
                </div>
            </div>

            {/* CARD SEMANA (BRANCO) */}
            <div className="flex-1 bg-white rounded-[32px] p-5 relative overflow-hidden shadow-[0_20px_40px_rgba(255,255,255,0.05)] transition-all active:scale-[0.98]">
                <h3 className="text-black/40 font-bold text-[10px] uppercase tracking-widest">15 abr à 21 abr</h3>

                <div className="flex items-center gap-1.5 text-black/60 font-bold mt-1 text-[13px]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    {showValues ? weekRevenue : "R$ •••••"}
                </div>

                <div className="text-[44px] font-black leading-none mt-6 text-black tracking-tighter">
                    {weekCount}
                </div>

                {/* ÍCONE DE FUNDO ESTILIZADO (IGUAL A FOTO) */}
                <div className="absolute -bottom-2 -right-2 text-black/5 -rotate-12">
                    <svg width="70" height="70" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};