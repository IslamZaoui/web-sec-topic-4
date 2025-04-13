import { authCookie } from '@/lib/auth/cookie';
import { validateSession } from '@/lib/auth/session';
import type { ExpressMiddleware } from '@/lib/types';

export default function authMiddleware(): ExpressMiddleware {
	return async (req, res, next) => {
		const sessionId = authCookie.get(req);
		if (!sessionId) {
			next();
			return;
		}

		const session = validateSession(sessionId);
		if (!session) {
			authCookie.clear(res);
			next();
			return;
		}

		res.locals.session = session;
		next();
	};
}
