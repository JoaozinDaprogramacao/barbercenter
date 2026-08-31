"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Store,
    Handshake,
    Wallet,
    ScrollText,
    Filter,
    LogOut,
} from "lucide-react";

const NAV = [
    { name: "Visão geral", href: "/console", icon: LayoutDashboard },
    { name: "Funil", href: "/console/funil", icon: Filter },
    { name: "Barbearias", href: "/console/barbearias", icon: Store },
    { name: "Embaixadores", href: "/console/afiliados", icon: Handshake },
    { name: "Comissões", href: "/console/comissoes", icon: Wallet },
    { name: "Auditoria", href: "/console/auditoria", icon: ScrollText },
];

type Props = {
    actor: { name: string; email: string; role: string };
    children: React.ReactNode;
};

export function ConsoleShell({ actor, children }: Props) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
            <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-[#0A0A0A] lg:flex">
                <div className="flex items-center gap-3 px-6 py-7">
                    <img src="/logo.png" alt="" className="h-9 w-auto object-contain" />
                    <div className="leading-none">
                        <p className="text-[0.95rem] font-black uppercase tracking-tighter text-[#F7EFE2]">
                            Barber<span className="text-[#D49A62]">Center</span>
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8E8E93]">
                            Console
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3">
                    {NAV.map((item) => {
                        // "/console" casaria com tudo por prefixo, então a raiz
                        // exige igualdade exata.
                        const active =
                            item.href === "/console"
                                ? pathname === "/console"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active
                                    ? "bg-[#B27B5C]/15 font-semibold text-[#D49A62]"
                                    : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/5 p-4">
                    <p className="truncate text-sm font-semibold text-white">{actor.name}</p>
                    <p className="truncate text-xs text-[#8E8E93]">{actor.email}</p>
                    <span className="mt-2 inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                        {actor.role}
                    </span>
                    <button
                        onClick={() => signOut({ callbackUrl: "/console/login" })}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-bold uppercase tracking-widest text-[#9CA3AF] transition-colors hover:border-white/20 hover:text-white"
                    >
                        <LogOut size={14} />
                        Sair
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center gap-1 overflow-x-auto border-b border-white/5 bg-[#0A0A0A] px-4 py-3 lg:hidden">
                    {NAV.map((item) => {
                        const active =
                            item.href === "/console"
                                ? pathname === "/console"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${active ? "bg-[#B27B5C]/15 text-[#D49A62]" : "text-[#9CA3AF]"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </header>

                <div className="min-w-0 flex-1 p-4 md:p-8">{children}</div>
            </div>
        </div>
    );
}
