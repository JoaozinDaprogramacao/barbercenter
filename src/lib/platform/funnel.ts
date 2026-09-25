/**
 * Definição do funil de aquisição.
 *
 * Esta lista é a fonte de verdade em três lugares: valida o que /api/track
 * aceita, define a ordem das etapas no painel e nomeia cada uma em português.
 * Etapa que não está aqui é rejeitada na entrada — o endpoint é público, e sem
 * allowlist qualquer um enche a tabela com lixo.
 */

export const FUNNEL_STEPS = [
    "LINK_CLICK",
    "LP_VIEW",
    "LP_SCROLL_50",
    "LP_SCROLL_90",
    "CTA_CLICK",
    "SIGNUP_VIEW",
    "SIGNUP_START",
    "SIGNUP_FIELD",
    "SIGNUP_SUBMIT",
    "SIGNUP_ERROR",
    "SIGNUP_SUCCESS",
    "ACTIVATION_FIRST_LOGIN",
    "ACTIVATION_SERVICE_CREATED",
    "ACTIVATION_TEAM_ADDED",
    "ACTIVATION_APPOINTMENT_CREATED",
    "ACTIVATION_LINK_SHARED",
    "CHECKOUT_VIEW",
    "CHECKOUT_START",
    "PAID",
] as const;

export type FunnelStep = (typeof FUNNEL_STEPS)[number];

const STEP_SET = new Set<string>(FUNNEL_STEPS);
export const isFunnelStep = (value: unknown): value is FunnelStep =>
    typeof value === "string" && STEP_SET.has(value);

export type FunnelStage = "AQUISICAO" | "CADASTRO" | "ATIVACAO" | "PAGAMENTO";

type StepMeta = {
    label: string;
    stage: FunnelStage;
    hint?: string;
    /** Etapas fora da linha principal não entram no cálculo de queda. */
    offPath?: boolean;
};

export const STEP_META: Record<FunnelStep, StepMeta> = {
    LINK_CLICK: { label: "Clique no link", stage: "AQUISICAO", hint: "Abriu /r/CODIGO" },
    LP_VIEW: { label: "Viu a landing", stage: "AQUISICAO" },
    LP_SCROLL_50: { label: "Leu metade", stage: "AQUISICAO", hint: "Rolou 50% da página" },
    LP_SCROLL_90: { label: "Leu até o fim", stage: "AQUISICAO", hint: "Rolou 90% da página" },
    CTA_CLICK: { label: "Clicou em criar conta", stage: "AQUISICAO" },
    SIGNUP_VIEW: { label: "Abriu o cadastro", stage: "CADASTRO" },
    SIGNUP_START: { label: "Começou a preencher", stage: "CADASTRO" },
    SIGNUP_FIELD: { label: "Preencheu campo", stage: "CADASTRO", offPath: true },
    SIGNUP_SUBMIT: { label: "Enviou o formulário", stage: "CADASTRO" },
    SIGNUP_ERROR: { label: "Recebeu erro", stage: "CADASTRO", offPath: true },
    SIGNUP_SUCCESS: { label: "Conta criada", stage: "CADASTRO" },
    ACTIVATION_FIRST_LOGIN: { label: "Entrou no app", stage: "ATIVACAO" },
    ACTIVATION_SERVICE_CREATED: { label: "Cadastrou serviço", stage: "ATIVACAO" },
    ACTIVATION_TEAM_ADDED: { label: "Adicionou barbeiro", stage: "ATIVACAO", offPath: true },
    ACTIVATION_APPOINTMENT_CREATED: { label: "Primeiro agendamento", stage: "ATIVACAO" },
    ACTIVATION_LINK_SHARED: { label: "Compartilhou a agenda", stage: "ATIVACAO", offPath: true },
    CHECKOUT_VIEW: { label: "Abriu o checkout", stage: "PAGAMENTO" },
    CHECKOUT_START: { label: "Iniciou pagamento", stage: "PAGAMENTO" },
    PAID: { label: "Virou pagante", stage: "PAGAMENTO" },
};

/** Só as etapas da linha principal, na ordem — é sobre elas que a queda é medida. */
export const MAIN_PATH: FunnelStep[] = FUNNEL_STEPS.filter((s) => !STEP_META[s].offPath);

export const STAGE_LABEL: Record<FunnelStage, string> = {
    AQUISICAO: "Aquisição",
    CADASTRO: "Cadastro",
    ATIVACAO: "Ativação",
    PAGAMENTO: "Pagamento",
};

// Cookie do visitante anônimo. httpOnly: o front não lê nem forja.
export const VISITOR_COOKIE = "bc_vid";
export const VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

/** Origem legível a partir do referer, para segmentar tráfego. */
export function sourceFromReferer(referer: string | null, host: string | null): string {
    if (!referer) return "direto";

    try {
        const url = new URL(referer);
        if (host && url.host === host) return "interno";

        const h = url.host.replace(/^www\./, "").toLowerCase();

        if (h.includes("instagram")) return "instagram";
        if (h.includes("youtube") || h.includes("youtu.be")) return "youtube";
        if (h.includes("tiktok")) return "tiktok";
        if (h.includes("facebook") || h.includes("fb.")) return "facebook";
        if (h.includes("google")) return "google";
        if (h.includes("whatsapp") || h.includes("wa.me")) return "whatsapp";
        return h.slice(0, 60);
    } catch {
        return "desconhecido";
    }
}

/** Bucket grosseiro de dispositivo — heatmap sério fica no Clarity. */
export function deviceFromUserAgent(ua: string | null): string {
    if (!ua) return "desconhecido";
    const s = ua.toLowerCase();
    if (/ipad|tablet|playbook|silk/.test(s)) return "tablet";
    if (/mobi|android|iphone|ipod/.test(s)) return "mobile";
    return "desktop";
}
