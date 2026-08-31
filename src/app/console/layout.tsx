import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Console | BarberCenter",
    // O painel interno não entra em buscador nem em preview de link.
    robots: { index: false, follow: false, nocache: true },
};

export default function ConsoleRootLayout({ children }: { children: React.ReactNode }) {
    // O tenant vive em max-w-md (mobile-first). O console é ferramenta de
    // desktop, então escapa dessa trava aqui.
    return <div className="min-h-screen bg-[#050505] text-white [&_main]:max-h-none">{children}</div>;
}
