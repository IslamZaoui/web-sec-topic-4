import { authCookie } from '@/lib/auth/cookie';
import { invalidateSession } from '@/lib/auth/session';
import type { ExpressHandler, SessionValidationResult } from '@/lib/types';

export default function logoutHandler(): ExpressHandler {
	return async (_, res) => {
		const session = res.locals.session as SessionValidationResult;

		if (!session) {
			res.status(401).json({
				code: 'UNAUTHORIZED',
				message: 'Unauthorized',
			});
			return;
		}

		await invalidateSession(session.id);
		authCookie.clear(res);

		res.status(200).send('Logged out successfully');
	};
}
