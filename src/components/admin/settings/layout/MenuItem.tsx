
import { ChevronRight } from "lucide-react";

export const MenuItem = ({ icon: Icon, title, subtitle, onClick }: any) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-5 border-b border-zinc-900 last:border-0 active:bg-zinc-900 transition-colors group"
    >
        <div className="flex items-center gap-5">
            <div className="w-11 h-11 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-[#D49A62] border border-zinc-800 shadow-inner">
                <Icon size={22} strokeWidth={1.5} />
            </div>
            <div className="text-left">
                <h3 className="text-[#F7EFE2] font-bold text-[16px] tracking-tight">{title}</h3>
                <p className="text-zinc-500 text-[12px] font-medium mt-0.5">{subtitle}</p>
            </div>
        </div>
        <ChevronRight size={18} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
    </button>
);
