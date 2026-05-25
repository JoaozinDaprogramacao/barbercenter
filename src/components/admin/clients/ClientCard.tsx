import { motion } from "framer-motion";
import { User, Phone, CalendarClock, CircleDollarSign } from "lucide-react";
import type { ClientData } from "@/hooks/useClients";

interface ClientCardProps {
    client: ClientData;
    index: number;
}

export function ClientCard({ client, index }: ClientCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getStatusColor = (days: number | null) => {
        if (days === null) return "text-zinc-500";
        if (days <= 20) return "text-green-500"; 
        if (days <= 30) return "text-yellow-500"; 
        return "text-red-500"; 
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-[#B87333]/30 transition-all group"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D49A62]/20 to-[#B87333]/20 flex items-center justify-center border border-[#B87333]/30 shrink-0">
                        <User className="text-[#D49A62]" size={24} />
                    </div>
                    <div>
                        <h3 className="text-[#F7EFE2] font-bold text-lg">{client.name}</h3>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm mt-0.5">
                            <Phone size={14} />
                            <span>{client.phone || "Sem telefone"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto bg-[#0A0A0A] sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] uppercase tracking-wider font-black">
                            <CalendarClock size={12} />
                            Última visita
                        </div>
                        <span className={`font-medium ${getStatusColor(client.daysSinceLastVisit)}`}>
                            {client.daysSinceLastVisit === null 
                                ? "Nunca veio" 
                                : client.daysSinceLastVisit === 0 
                                    ? "Hoje"
                                    : `Há ${client.daysSinceLastVisit} dias`
                            }
                        </span>
                    </div>

                    <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] uppercase tracking-wider font-black">
                            <CircleDollarSign size={12} />
                            Total Gasto
                        </div>
                        <span className="text-[#D49A62] font-bold">
                            {formatCurrency(client.totalSpent)}
                        </span>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}