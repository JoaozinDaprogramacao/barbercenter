export interface TrialRule {
    days: number;
    title: string;
    message: string;
    buttonText: string;
    variant: 'info' | 'warning' | 'critical';
}

export const TRIAL_RULES: TrialRule[] = [
    {
        days: 1, // Se faltar 1, ele para aqui.
        title: "⚠️ ÚLTIMO DIA!",
        message: "Seu acesso expira amanhã. Não perca seus dados e o histórico dos seus clientes. Assine agora!",
        buttonText: "Assinar e Liberar",
        variant: 'critical'
    },
    {
        days: 2,
        title: "⏳ Faltam 48 Horas",
        message: "Sua barbearia vai parar? Evite o bloqueio dos seus agendamentos amanhã. Assine agora!",
        buttonText: "Regularizar Acesso",
        variant: 'critical'
    },
    {
        days: 3,
        title: "🔥 Oferta Final: 20% OFF",
        message: "Faltam 3 dias! Use o código QUERO20 e garanta sua barbearia no próximo nível por um preço especial.",
        buttonText: "Aproveitar Agora",
        variant: 'warning'
    },
    {
        days: 5,
        title: "⚡ O tempo está voando!",
        message: "Restam apenas 5 dias. Não corra o risco de ter sua agenda bloqueada, regularize agora.",
        buttonText: "Ver Planos",
        variant: 'warning'
    },
    {
        days: 10,
        title: "🎁 Presente para você",
        message: "Gostando da gestão? Assine hoje e ganhe 10% de desconto no primeiro mês com o cupom PRIMEIRA10.",
        buttonText: "Garantir Desconto",
        variant: 'info'
    },
    {
        days: 14,
        title: "💈 Tudo pronto por aí?",
        message: "Você ainda tem 2 semanas. Já configurou seus serviços e equipe para começar a lucrar?",
        buttonText: "Configurar Agora",
        variant: 'info'
    }
];