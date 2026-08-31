"use client";

import { ReactNode } from "react";

export const brl = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);

export const pct = (value: number) =>
    `${((value ?? 0) * 100).toFixed(1).replace(".", ",")}%`;

export const dateBR = (value: string | Date | null | undefined) =>
    value ? new Date(value).toLocaleDateString("pt-BR") : "—";

export const dateTimeBR = (value: string | Date | null | undefined) =>
    value
        ? new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
        : "—";

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
    return (
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-[#8E8E93]">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export function StatCard({
    label,
    value,
    hint,
    tone = "default",
}: {
    label: string;
    value: string | number;
    hint?: string;
    tone?: "default" | "accent" | "success" | "danger";
}) {
    const toneClass = {
        default: "text-white",
        accent: "text-[#D49A62]",
        success: "text-[#82D173]",
        danger: "text-[#F87171]",
    }[tone];

    return (
        <div className="rounded-2xl border border-white/5 bg-[#101012] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8E8E93]">{label}</p>
            <p className={`mt-2 text-2xl font-black tracking-tight ${toneClass}`}>{value}</p>
            {hint && <p className="mt-1 text-xs text-[#8E8E93]">{hint}</p>}
        </div>
    );
}

export function Card({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
    return (
        <section className="rounded-2xl border border-white/5 bg-[#101012]">
            {(title || action) && (
                <header className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4">
                    {title && <h2 className="text-sm font-bold text-white">{title}</h2>}
                    {action}
                </header>
            )}
            <div className="p-5">{children}</div>
        </section>
    );
}

const BADGE_TONES: Record<string, string> = {
    ACTIVE: "bg-[#82D173]/15 text-[#82D173]",
    PRO: "bg-[#82D173]/15 text-[#82D173]",
    PAID: "bg-[#82D173]/15 text-[#82D173]",
    APPROVED: "bg-[#60A5FA]/15 text-[#60A5FA]",
    TRIAL: "bg-[#D49A62]/15 text-[#D49A62]",
    PENDING: "bg-[#D49A62]/15 text-[#D49A62]",
    PAUSED: "bg-white/10 text-[#9CA3AF]",
    FREE: "bg-white/10 text-[#9CA3AF]",
    CHURNED: "bg-[#F87171]/15 text-[#F87171]",
    REVERSED: "bg-[#F87171]/15 text-[#F87171]",
    BANNED: "bg-[#F87171]/15 text-[#F87171]",
};

export function Badge({ value, label }: { value: string; label?: string }) {
    return (
        <span
            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${BADGE_TONES[value] ?? "bg-white/10 text-[#9CA3AF]"
                }`}
        >
            {label ?? value}
        </span>
    );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
    return (
        // Tabela larga rola dentro do próprio contêiner; a página nunca rola na horizontal.
        <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                    <tr className="border-b border-white/5">
                        {head.map((h) => (
                            <th
                                key={h}
                                className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-[#8E8E93]"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export function Empty({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl border border-dashed border-white/10 py-10 text-center text-xs text-[#8E8E93]">
            {children}
        </div>
    );
}

export function Spinner() {
    return (
        <div className="flex justify-center py-12">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#B27B5C]/30 border-t-[#B27B5C]" />
        </div>
    );
}

export function Button({
    children,
    onClick,
    variant = "primary",
    type = "button",
    disabled,
    className = "",
}: {
    children: ReactNode;
    onClick?: () => void;
    variant?: "primary" | "ghost" | "danger";
    type?: "button" | "submit";
    disabled?: boolean;
    className?: string;
}) {
    const variants = {
        primary: "bg-[#B27B5C] text-black hover:bg-[#C49174]",
        ghost: "border border-white/10 text-[#9CA3AF] hover:border-white/20 hover:text-white",
        danger: "border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/10",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#8E8E93]">
                {label}
            </span>
            {children}
        </label>
    );
}

export const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#5A5A5F] focus:border-[#B27B5C]";
