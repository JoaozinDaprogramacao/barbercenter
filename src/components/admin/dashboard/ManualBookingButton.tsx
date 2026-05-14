"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ManualBookingButtonProps {
    onClick: () => void;
}

export function ManualBookingButton({ onClick }: ManualBookingButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="w-full mt-4 py-4 flex items-center justify-center gap-2 bg-[#100D0B] border border-dashed border-[#B87333]/40 rounded-[1.5rem] text-[#D49A62] font-bold text-xs uppercase tracking-widest hover:bg-[#B87333]/10 transition-colors shadow-sm"
        >
            <Plus size={16} strokeWidth={3} />
            Agendamento Manual
        </motion.button>
    );
}