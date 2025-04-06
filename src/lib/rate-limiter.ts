import type { Request } from 'express';
import { RATE_LIMITER_KV } from './cache';

export const rateLimiter = {
	check: (req: Request, prefix: string) => {
		// create user identifier
		const requesterID = `${prefix}-${req.ip || 'unknown'}`;

		// get user's rate count from cache
		const count = RATE_LIMITER_KV.get(requesterID);

		// check if user is rate limited
		if (count >= 5) {
			return true;
		}
		
		// increment user's rate count in cache
		RATE_LIMITER_KV.set(requesterID, count + 1);
		return false;
	},
	reset: () => {
		// clear rate limit cache
		RATE_LIMITER_KV.clear();
	},
};
