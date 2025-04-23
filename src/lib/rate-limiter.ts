import TTLCache from '@isaacs/ttlcache';
import type { Request } from 'express';

type RateLimitData = {
	count: number;
	timestamp: number;
};

// create rate limit cache
const cache = new TTLCache<string, RateLimitData>({
	max: 1000,
	ttl: 1000 * 60 * 15, // 15 minutes
});

export const rateLimiter = {
	check: (req: Request) => {
		const key = req.ip || 'unknown';
		// get user's rate attempts from cache
		const { count, timestamp } = cache.get(key) || { count: 0, timestamp: Date.now() };

		// check if user is rate limited
		if (count >= 3) {
			const timeElapsed = Date.now() - timestamp;
			const timeRemaining = Math.max(0, 1000 * 60 * 15 - timeElapsed);
			const secondsRemaining = Math.floor(timeRemaining / 1000);
			return { isLimited: true, secondsRemaining };
		}

		// increment user's rate attempts in cache
		cache.set(key, { count: count + 1, timestamp });
		return { isLimited: false, secondsRemaining: 0 };
	},
	reset: (req: Request) => {
		cache.delete(req.ip || 'unknown');
	},
};
