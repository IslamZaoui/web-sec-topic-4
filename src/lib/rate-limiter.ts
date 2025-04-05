import type { Request } from 'express';
import { RATE_LIMITER_KV } from './cache';

export const rateLimiter = {
	check: (req: Request, prefix: string) => {
		const requesterID = `${prefix}-${req.ip || 'unknown'}`;

		const count = RATE_LIMITER_KV.get(requesterID);
		if (count >= 5) {
			return true;
		}
		RATE_LIMITER_KV.set(requesterID, count + 1);
		return false;
	},
	reset: () => {
		RATE_LIMITER_KV.clear();
	},
};
