import { motion } from "framer-motion";
import { 
    CalendarRange, 
    Receipt, 
    RefreshCw, 
    AlertTriangle, 
    Crown, 
    UserMinus, 
    Scissors 
} from "lucide-react";

interface BarberRevenue {
    nome: string;
    faturamento: number;
    comissao: number;
}

interface BusinessMetricsProps {
    metrics?: {
        occupancyRate: number;
        ticketMedio: number;
        frequenciaMedia: number;
        clientesRisco: number;
        ltvBruto: number;
        evasaoRate: number;
        faturamentoBarbeiros: BarberRevenue[];
    };
}

export function BusinessMetrics({ metrics }: BusinessMetricsProps) {
    const data = metrics || {
        occupancyRate: 0,
        ticketMedio: 0,
        frequenciaMedia: 0,
        clientesRisco: 0,
        ltvBruto: 0,
        evasaoRate: 0,
        faturamentoBarbeiros: []
    };

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const MetricCard = ({ title, value, subtitle, icon: Icon, alert = false }: any) => (
        <div className="flex flex-col py-4">
            <div className="flex items-center gap-2 mb-2">
                <Icon size={18} strokeWidth={2.5} className={alert ? 'text-red-500' : 'text-[#D49A62]'} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 line-clamp-1">
                    {title}
                </span>
            </div>
            <div className={`text-3xl font-black tracking-tighter ${alert ? 'text-red-500' : 'text-[#F7EFE2]'}`}>
                {value}
            </div>
            <div className="text-[10px] font-bold text-zinc-600 mt-1 uppercase tracking-widest">
                {subtitle}
            </div>
        </div>
    );

    return (
        <div className="mt-8 pt-8 border-t border-white/5 pb-12">
            <div className="mb-8">
                <h3 className="text-[#F7EFE2] font-black uppercase text-[11px] tracking-[0.2em] opacity-50">Inteligência do Negócio</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-10">
                <MetricCard 
                    title="Ocupação" 
                    value={`${data.occupancyRate}%`} 
                    subtitle="Tempo produtivo" 
                    icon={CalendarRange} 
                />
                <MetricCard 
                    title="Ticket Médio" 
                    value={formatCurrency(data.ticketMedio)} 
                    subtitle="Gasto por visita" 
                    icon={Receipt} 
                />
                <MetricCard 
                    title="Retorno" 
                    value={`${data.frequenciaMedia}d`} 
                    subtitle="Frequência média" 
                    icon={RefreshCw} 
                />
                <MetricCard 
                    title="Risco Churn" 
                    value={data.clientesRisco} 
                    subtitle="Clientes sumidos" 
                    icon={AlertTriangle} 
                    alert={data.clientesRisco > 0}
                />
                <MetricCard 
                    title="LTV Bruto" 
                    value={formatCurrency(data.ltvBruto)} 
                    subtitle="Valor vitalício" 
                    icon={Crown} 
                />
                <MetricCard 
                    title="Evasão" 
                    value={`${data.evasaoRate}%`} 
                    subtitle="No-shows/Cancel." 
                    icon={UserMinus} 
                    alert={data.evasaoRate > 10}
                />
            </div>

            {/* Faturamento por Barbeiro */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Scissors size={16} strokeWidth={2.5} className="text-[#D49A62]" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Repasse & Comissões</h4>
                </div>
                
                {data.faturamentoBarbeiros.length > 0 ? (
                    <div className="flex flex-col">
                        {data.faturamentoBarbeiros.map((barber, idx) => (
                            <div key={idx} className="flex flex-col py-5 border-b border-white/5 last:border-0">
                                <span className="text-xl font-black text-[#F7EFE2] mb-4">{barber.nome}</span>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Produção</span>
                                        <span className="text-[#D49A62] font-black text-2xl">{formatCurrency(barber.faturamento)}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Comissão</span>
                                        <span className="text-zinc-400 font-black text-xl">{formatCurrency(barber.comissao)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-4">
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Sem dados no período</span>
                    </div>
                )}
            </div>
        </div>
    );
}