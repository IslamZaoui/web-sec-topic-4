import TTLCache from '@isaacs/ttlcache';
import type { Request } from 'express';

// create rate limit cache
const cache = new TTLCache<string, number>({
	max: 1000,
	ttl: 1000 * 60 * 60, // 1 hour
});

export const rateLimiter = {
	check: (req: Request, prefix: string) => {
		// create user identifier
		const requesterID = `${prefix}-${req.ip || 'unknown'}`;

		// get user's rate attempts from cache
		const count = cache.get(requesterID) || 0;

		// check if user is rate limited
		if (count >= 5) {
			return true;
		}

		// increment user's rate attempts in cache
		cache.set(requesterID, count + 1);
		return false;
	},
	reset: (/* req: Request, prefix: string */) => {
		// clear rate limit cache
		cache.clear();

		/*  fix to the broken brute-force protection
			const requesterID = `${prefix}-${req.ip || 'unknown'}`;
			cache.delete(requesterID)
		*/
	},
};
