"use client";

import { useState, useEffect, useMemo } from "react";
import { differenceInDays } from "date-fns";
import { TRIAL_RULES } from "@/config/trialRules"; // Importando do seu config

export function useSubscription() {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isPlanActive, setIsPlanActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/barbershop");
        const data = await response.json();

        if (data.barbershop) {
          const { planStatus, trialExpiresAt, planExpiresAt } = data.barbershop;
          const expirationDate = planExpiresAt ? new Date(planExpiresAt) :
            trialExpiresAt ? new Date(trialExpiresAt) : null;

          if (planStatus === "ACTIVE" || planStatus === "PRO") {
            setIsPlanActive(true);
          } else if (expirationDate) {
            const now = new Date();
            // Comparação exata de milissegundos
            const expired = now > expirationDate;

            if (expired) {
              setDaysRemaining(0); // Força o estado de expirado
            } else {
              const diff = differenceInDays(expirationDate, now);
              setDaysRemaining(diff + 1); // Ajusta para mostrar "1 dia" se expirar hoje
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar assinatura:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  /**
   * Seleção da Oferta Ativa
   * Filtra o array TRIAL_RULES importado do config
   */
  const activeOffer = useMemo(() => {
    if (loading || isPlanActive || daysRemaining === null) return null;

    // Encontra a primeira regra onde os dias restantes são menores ou iguais ao limite definido
    // Importante: O array no config deve estar ordenado do maior para o menor dia para funcionar corretamente
    return TRIAL_RULES.find(rule => daysRemaining <= rule.days) || null;
  }, [daysRemaining, isPlanActive, loading]);

  return {
    daysRemaining,
    isPlanActive,
    loading,
    activeOffer
  };
}