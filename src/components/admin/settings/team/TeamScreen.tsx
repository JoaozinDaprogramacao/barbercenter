"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, ShieldAlert } from "lucide-react";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Monograma para pessoas (Ex: "João Silva" -> "JS")
const getInitials = (name: string) => {
    if (!name) return "US";
    const words = name.trim().split(" ").filter(w => w.length > 0);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

export const TeamSection = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [myRole, setMyRole] = useState<string>("BARBER"); 
    const [isLoading, setIsLoading] = useState(true);
    
    // Controles do Bottom Sheet
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch("/api/settings/team");
            if (res.ok) {
                const data = await res.json();
                setTeam(data.members); 
                setMyRole(data.currentUserRole); 
            }
        } catch (error) {
            console.error("Erro ao buscar equipe:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            const res = await fetch("/api/settings/team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro ao criar usuário");
            }

            await fetchTeam();
            setIsAdding(false);
            setFormData({ name: "", email: "", password: "" });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full flex flex-col flex-1 pb-10">
            
            {/* HEADER DA SEÇÃO */}
            <div className="flex justify-between items-end px-6 pb-4 pt-6">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Equipe e Acessos
                </h3>
            </div>

            {/* ÁREA DA LISTA */}
            <div className="w-full px-5 space-y-3">
                
                {/* Botão de Adicionar (Apenas para o Dono) */}
                {myRole === "OWNER" && (
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#B87333]/30 bg-[#B87333]/5 hover:bg-[#B87333]/10 transition-colors group"
                    >
                        {/* Avatar tracejado redondo para indicar "Pessoa" */}
                        <div className="w-12 h-12 rounded-full bg-[#D49A62]/10 flex items-center justify-center text-[#D49A62] group-hover:scale-110 transition-transform">
                            <Plus size={24} strokeWidth={2.5} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[#D49A62] font-bold text-[15px]">Novo Barbeiro</h4>
                            <p className="text-[#D49A62]/60 text-[12px] font-medium mt-0.5">Convidar para o sistema</p>
                        </div>
                    </motion.button>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-[#D49A62]" size={28} />
                    </div>
                )}

                {/* Lista de Membros */}
                {!isLoading && team.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-4">Nenhum membro encontrado.</p>
                ) : (
                    !isLoading && team.map((member, index) => {
                        const initials = getInitials(member.name);
                        const isOwner = member.role === "OWNER";
                        
                        return (
                            <motion.div 
                                key={member.id} 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border bg-[#0A0A0A] border-zinc-800/80 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar Circular com Monograma */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-inner
                                        ${isOwner ? 'bg-gradient-to-br from-[#D49A62] to-[#B87333] border-transparent text-[#050505]' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}
                                    `}>
                                        <span className="font-black text-[15px] tracking-wider">{initials}</span>
                                    </div>

                                    {/* Informações */}
                                    <div className="text-left flex flex-col justify-center">
                                        <span className="text-[15px] font-bold text-white tracking-tight">
                                            {member.name}
                                        </span>
                                        <span className="text-[12px] text-zinc-500 font-medium mt-0.5">
                                            {member.email}
                                        </span>
                                    </div>
                                </div>

                                {/* Badge de Cargo */}
                                <div className="flex items-center">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${
                                        isOwner 
                                        ? 'bg-[#B87333]/10 text-[#D49A62] border border-[#B87333]/20' 
                                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                                    }`}>
                                        {isOwner ? 'Dono' : 'Barbeiro'}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* MODAL BOTTOM SHEET (Formulário de Adição) */}
            <AnimatePresence>
                {isAdding && myRole === "OWNER" && (
                    <div className="fixed inset-0 z-[200] flex items-end justify-center font-sans">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)} 
                            className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" 
                        />

                        {/* Bottom Sheet Body */}
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-[#0A0A0A] border-t border-zinc-800 rounded-t-[2rem] px-6 pt-4 pb-10 z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 shrink-0" />

                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h4 className="text-lg font-black text-white tracking-tight uppercase">
                                    Novo Barbeiro
                                </h4>
                                <button onClick={() => setIsAdding(false)} className="text-zinc-500 font-bold text-sm">Cancelar</button>
                            </div>

                            <form onSubmit={handleAddMember} className="overflow-y-auto no-scrollbar pb-6 space-y-4">
                                
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold">
                                        <ShieldAlert size={16} />
                                        {error}
                                    </div>
                                )}

                                {/* Inputs Estilo Ajustes iOS */}
                                <div className="w-full bg-[#111111] border border-zinc-900 rounded-2xl overflow-hidden">
                                    
                                    <div className="flex flex-col px-4 py-3 border-b border-zinc-900/50">
                                        <label className="text-[10px] font-black text-[#B87333] uppercase tracking-widest">Nome do Profissional</label>
                                        <input
                                            required autoFocus
                                            className="w-full bg-transparent text-white text-[16px] font-semibold outline-none mt-1 placeholder:text-zinc-700"
                                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ex: João Silva"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col px-4 py-3 border-b border-zinc-900/50">
                                        <label className="text-[10px] font-black text-[#B87333] uppercase tracking-widest">E-mail de Acesso</label>
                                        <input
                                            type="email" required
                                            className="w-full bg-transparent text-white text-[16px] font-semibold outline-none mt-1 placeholder:text-zinc-700"
                                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="joao@barbearia.com"
                                        />
                                    </div>

                                    <div className="flex flex-col px-4 py-3">
                                        <label className="text-[10px] font-black text-[#B87333] uppercase tracking-widest">Senha de Acesso</label>
                                        <input
                                            type="password" required minLength={6}
                                            className="w-full bg-transparent text-white text-[16px] font-semibold outline-none mt-1 placeholder:text-zinc-700"
                                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                    </div>

                                </div>

                                <button
                                    type="submit" disabled={isSaving}
                                    className="w-full bg-[#D49A62] text-[#050505] py-4 rounded-xl font-black text-[13px] uppercase tracking-[0.2em] transition-all flex justify-center items-center active:scale-[0.98] mt-4"
                                >
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : "Criar Acesso"}
                                </button>
                            </form>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};