"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Microsoft Clarity: mapa de calor, scroll map, rage-click e gravação de
 * sessão. Grátis e ilimitado.
 *
 * Fica de fora do funil próprio de propósito — heatmap exige capturar
 * coordenadas por breakpoint e renderizar overlay, semanas de trabalho para
 * um resultado pior. O funil, que precisa cruzar com embaixador e comissão,
 * é o que construímos em casa.
 *
 * Só carrega se NEXT_PUBLIC_CLARITY_ID estiver definido: sem a variável, nada
 * é injetado e nenhuma requisição sai para a Microsoft.
 */
export function Clarity({ projectId }: { projectId?: string }) {
    // Marca a sessão com o código do embaixador, permitindo filtrar as
    // gravações por quem indicou — é o elo entre as duas ferramentas.
    useEffect(() => {
        if (!projectId) return;

        fetch("/api/ref/current")
            .then((r) => (r.ok ? r.json() : { referral: null }))
            .then((data) => {
                const w = window as unknown as { clarity?: (...args: unknown[]) => void };
                if (typeof w.clarity !== "function") return;
                w.clarity("set", "origem", data.referral ? data.referral.code : "organico");
            })
            .catch(() => { });
    }, [projectId]);

    if (!projectId) return null;

    return (
        <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${projectId}");`}
        </Script>
    );
}
