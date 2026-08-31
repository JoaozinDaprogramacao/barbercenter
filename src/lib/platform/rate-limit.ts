/**
 * Rate limit em memória para o login do painel.
 *
 * É a primeira barreira, não a única: o bloqueio durável fica em
 * `platform_users.failedLoginAttempts` / `lockedUntil`, que sobrevive a
 * restart do processo e a troca de IP do atacante. Este limiter só corta a
 * enxurrada antes de encostar no banco.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Limpeza preguiçosa: a cada 500 chaves, varre e descarta o que já expirou.
function sweep(now: number) {
    if (buckets.size < 500) return;
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    sweep(now);

    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    bucket.count += 1;

    if (bucket.count > limit) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
        };
    }

    return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

export function resetRateLimit(key: string) {
    buckets.delete(key);
}
