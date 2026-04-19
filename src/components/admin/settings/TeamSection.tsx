"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const TeamSection = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [myRole, setMyRole] = useState<string>("BARBER"); // <-- Estado para guardar a permissão
    const [isLoading, setIsLoading] = useState(true);
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
                setTeam(data.members); // Recebe a lista
                setMyRole(data.currentUserRole); // Recebe se é OWNER ou BARBER
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

    if (isLoading) {
        return <div className="animate-pulse bg-zinc-900/50 border border-zinc-800 h-40 rounded-[2.5rem] w-full"></div>;
    }

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg">Membros da Equipe</h3>
                    <p className="text-zinc-500 text-xs">
                        {myRole === "OWNER" ? "Gerencie quem tem acesso ao sistema" : "Seus colegas de trabalho"}
                    </p>
                </div>
                {/* 👇 SÓ MOSTRA O BOTÃO SE FOR O DONO E NÃO ESTIVER ADICIONANDO */}
                {myRole === "OWNER" && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold"
                    >
                        + Novo Barbeiro
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAdding && myRole === "OWNER" ? (
                    <motion.form
                        key="add-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddMember}
                        className="space-y-4"
                    >
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                        
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-2">Nome do Profissional</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors mt-1"
                                placeholder="Ex: João Silva"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-2">E-mail de Acesso</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors mt-1"
                                placeholder="joao@barbearia.com"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-2">Senha de Acesso</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors mt-1"
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setError("");
                                }}
                                className="flex-1 py-3 rounded-2xl text-zinc-400 font-bold text-sm bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 py-3 rounded-2xl text-white font-bold text-sm bg-orange-600 hover:bg-orange-500 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? "Salvando..." : "Salvar Barbeiro"}
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        key="team-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        {team.length === 0 ? (
                            <p className="text-zinc-500 text-sm text-center py-4">Nenhum membro encontrado.</p>
                        ) : (
                            team.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-black/40 border border-zinc-800/50 rounded-2xl">
                                    <div>
                                        <p className="text-white text-sm font-bold">{member.name}</p>
                                        <p className="text-zinc-500 text-xs">{member.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                                            member.role === 'OWNER' 
                                            ? 'bg-orange-600/20 text-orange-500' 
                                            : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                            {member.role === 'OWNER' ? 'Dono' : 'Barbeiro'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};