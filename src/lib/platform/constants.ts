// Valores canônicos dos campos String de status da plataforma.
// O schema usa String (idioma do projeto), então a garantia de tipo vive aqui.

export const PLATFORM_ROLES = ["SUPERADMIN", "ANALYST"] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const AFFILIATE_STATUS = ["PENDING", "ACTIVE", "PAUSED", "BANNED"] as const;
export type AffiliateStatus = (typeof AFFILIATE_STATUS)[number];

export const REFERRAL_STATUS = ["TRIAL", "ACTIVE", "CHURNED"] as const;
export type ReferralStatus = (typeof REFERRAL_STATUS)[number];

export const COMMISSION_STATUS = ["PENDING", "APPROVED", "PAID", "REVERSED"] as const;
export type CommissionStatus = (typeof COMMISSION_STATUS)[number];

export const PAYOUT_STATUS = ["PENDING", "PAID", "CANCELLED"] as const;
export type PayoutStatus = (typeof PAYOUT_STATUS)[number];

// planStatus da Barbershop. O webhook grava PRO; TRIAL vem do cadastro;
// FREE é o estado pós-cancelamento.
export const PLAN_ACTIVE_STATUSES = ["PRO", "ACTIVE"] as const;

export const AFFILIATE_STATUS_LABEL: Record<string, string> = {
    PENDING: "Aguardando aprovação",
    ACTIVE: "Ativo",
    PAUSED: "Pausado",
    BANNED: "Banido",
};

export const COMMISSION_STATUS_LABEL: Record<string, string> = {
    PENDING: "Pendente",
    APPROVED: "Aprovada",
    PAID: "Paga",
    REVERSED: "Estornada",
};

// Cookie de atribuição do afiliado. httpOnly: o front nunca lê nem escreve.
export const REFERRAL_COOKIE = "bc_ref";
export const REFERRAL_COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 dias

// Código do afiliado: A-Z, 0-9, hífen. Sem espaço, sem acento, sem case-sensitivity.
export const AFFILIATE_CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,23}$/;

export function normalizeAffiliateCode(raw: string): string {
    return String(raw ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "")
        .slice(0, 24);
}

export function isValidAffiliateCode(code: string): boolean {
    return AFFILIATE_CODE_PATTERN.test(code);
}

export function competenceOf(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
