import TTLCache from '@isaacs/ttlcache';

const cache = new TTLCache<string, number>({
	max: 1000,
	ttl: 1000 * 60 * 60, // 1 hour
});

export const RATE_LIMITER_KV = {
	get: (id: string) => cache.get(id) || 0,
	set: (id: string, value: number) => cache.set(id, value),
	clear: () => cache.clear(),
};
