import { redirect } from "next/navigation";
import { getPlatformActor } from "@/lib/platform/auth";
import { ConsoleShell } from "@/components/console/ConsoleShell";

// Terceira camada de checagem, depois do proxy e das rotas /api/console.
// Aqui a validação é server-side e relê o banco, então um JWT de admin já
// desativado não renderiza o painel nem por um frame.
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
    const actor = await getPlatformActor();

    if (!actor) redirect("/console/login");

    return <ConsoleShell actor={actor}>{children}</ConsoleShell>;
}
