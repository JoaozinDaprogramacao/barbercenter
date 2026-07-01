export function LoadingScreen() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#B87333]/20 border-t-[#B87333] rounded-full animate-spin" />
            <p className="mt-4 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Buscando dados</p>
        </div>
    );
}