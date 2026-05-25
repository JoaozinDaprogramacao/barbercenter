'use client';

import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useClients } from '@/hooks/useClients';
import { ClientCard } from '@/components/admin/clients/ClientCard';

export default function ClientsDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const barbershopId = (session?.user as any)?.barbershopId || "";
    
    const { clients, isLoading, error } = useClients(barbershopId);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.phone && client.phone.includes(searchTerm))
    );

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#050505] flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-[#D49A62] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#050505] p-6 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(184,115,51,0.08),transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_left,rgba(212,154,98,0.05),transparent_70%)] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.back()}
                    className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-[#F7EFE2] transition-colors mb-6 will-change-transform"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </motion.button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D49A62]/20 to-[#B87333]/20 flex items-center justify-center border border-[#B87333]/30">
                                <Users className="text-[#D49A62]" size={20} />
                            </div>
                            <h1 className="text-3xl font-black text-[#F7EFE2] uppercase tracking-tighter">
                                Meus Clientes
                            </h1>
                        </div>
                        <p className="text-zinc-400 text-sm">
                            Gerencie sua carteira, veja quem está sumido e o LTV de cada cliente.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou número..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[#F7EFE2] placeholder:text-zinc-600 focus:outline-none focus:border-[#B87333]/50 transition-colors"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-2 border-[#D49A62] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-red-400 text-center py-10 bg-red-500/10 rounded-xl border border-red-500/20">
                        {error}
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Users className="mx-auto text-zinc-600 mb-4" size={48} />
                        <h3 className="text-[#F7EFE2] font-bold text-xl mb-2">Nenhum cliente encontrado</h3>
                        <p className="text-zinc-500">
                            {searchTerm ? "Ninguém corresponde a essa busca." : "Você ainda não tem clientes cadastrados."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredClients.map((client, index) => (
                            <ClientCard key={client.id} client={client} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}