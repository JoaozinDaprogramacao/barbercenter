
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ScreenLayout = ({ title, onBack, children }: { title: string, onBack: () => void, children: React.ReactNode }) => (
    <main className="h-[100dvh] w-full flex flex-col bg-[#050505] max-w-md mx-auto relative overflow-hidden font-sans border-x border-white/5">
        <header className="px-6 py-6 flex items-center border-b border-zinc-900 bg-[#050505]/80 backdrop-blur-lg sticky top-0 z-20">
            <button 
                onClick={onBack}
                className="flex items-center text-[#D49A62] active:opacity-50 transition-opacity p-1 -ml-2"
            >
                <ChevronLeft size={28} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2">
                <h1 className="text-[11px] font-black text-white uppercase tracking-[0.3em] truncate text-center">{title}</h1>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="px-6" // Respiro lateral maior para o conteúdo
            >
                {children}
            </motion.div>
        </div>
    </main>
);