import { authCookie } from '@/lib/auth/cookie';
import { validateSession } from '@/lib/auth/session';
import type { ExpressMiddleware } from '@/lib/types';

export default function authMiddleware(): ExpressMiddleware {
	return async (req, res, next) => {
		const sessionId = authCookie.get(req);
		if (!sessionId) {
			return next();
		}

		const session = validateSession(sessionId);
		if (!session) {
			authCookie.clear(res);
			return next();
		}

		res.locals.session = session;
		return next();
	};
}
