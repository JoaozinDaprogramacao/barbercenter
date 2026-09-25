"use client";

import type { FunnelStep } from "@/lib/platform/funnel";

/**
 * Disparo de eventos do funil a partir do navegador.
 *
 * Nunca bloqueia e nunca quebra a página: telemetria que atrapalha o usuário
 * custa mais conversão do que a métrica vale. Também deduplica no cliente —
 * o servidor já deduplica, mas evitar a viagem é mais barato que corrigi-la lá.
 */

const sent = new Set<string>();

export function trackEvent(
    step: FunnelStep,
    options: { key?: string; metadata?: Record<string, unknown>; once?: boolean } = {}
) {
    if (typeof window === "undefined") return;

    const dedupeKey = `${step}:${options.key ?? ""}`;
    if (options.once !== false) {
        if (sent.has(dedupeKey)) return;
        sent.add(dedupeKey);
    }

    const payload = JSON.stringify({
        step,
        key: options.key,
        metadata: options.metadata,
        path: window.location.pathname,
    });

    try {
        // keepalive garante a entrega mesmo se a navegação acontecer no mesmo
        // instante — é o caso do clique no CTA, que sai da página em seguida.
        // sendBeacon não serve aqui porque não manda cookies em todos os
        // navegadores; o cookie é o que identifica o visitante.
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
            credentials: "same-origin",
        }).catch(() => { });
    } catch {
        // Silêncio proposital.
    }
}
