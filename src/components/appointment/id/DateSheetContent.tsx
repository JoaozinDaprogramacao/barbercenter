import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { DateSelector } from "@/components/DateSelector";
import { TimeGrid } from "@/components/TimeGrid";

interface DateSheetContentProps {
    date: string;
    time: string;
    setDate: (date: string) => void;
    setTime: (time: string) => void;
    getTimes: (date: string) => string[];
}

export function DateSheetContent({ date, time, setDate, setTime, getTimes }: DateSheetContentProps) {
    return (
        <div className="flex flex-col gap-y-8 py-4">
            <div className="space-y-2">
                <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Calendar size={12} /> Reagendar
                </p>
                <h3 className="text-3xl font-black text-white tracking-tighter">Novo Horário</h3>
            </div>
            <DateSelector value={date} onChange={(d) => { setDate(d); setTime(""); }} />
            {date && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-800" />
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} /> Disponíveis
                        </span>
                        <div className="h-px flex-1 bg-zinc-800" />
                    </div>
                    <TimeGrid value={time} availableTimes={getTimes(date)} onChange={setTime} />
                </motion.div>
            )}
        </div>
    );
}