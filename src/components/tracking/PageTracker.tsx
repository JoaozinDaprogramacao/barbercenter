"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track-client";
import type { FunnelStep } from "@/lib/platform/funnel";

/**
 * Marca a visualização de uma página e, opcionalmente, a profundidade de
 * leitura. O scroll é medido porque "abriu a landing" e "leu a landing" são
 * coisas diferentes — quem sai na primeira dobra não rejeitou a oferta, ele
 * nem chegou a vê-la.
 */
export function PageTracker({
    step,
    trackScroll = false,
}: {
    step: FunnelStep;
    trackScroll?: boolean;
}) {
    useEffect(() => {
        trackEvent(step);

        if (!trackScroll) return;

        let ticking = false;

        const measure = () => {
            ticking = false;

            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;

            const progress = (window.scrollY / scrollable) * 100;

            // trackEvent já deduplica, então disparar de novo é inofensivo.
            if (progress >= 50) trackEvent("LP_SCROLL_50");
            if (progress >= 90) trackEvent("LP_SCROLL_90");
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(measure);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        measure(); // telas curtas já nascem no fim da página

        return () => window.removeEventListener("scroll", onScroll);
    }, [step, trackScroll]);

    return null;
}
