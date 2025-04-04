import { RATE_LIMITER_KV } from './cache';

export const rateLimiter = {
	check: (id: string) => {
		const count = RATE_LIMITER_KV.get(id);
		if (count >= 5) {
			return true;
		}
		RATE_LIMITER_KV.set(id, count + 1);
		return false;
	},
	reset: () => {
		RATE_LIMITER_KV.clear();
	},
};
