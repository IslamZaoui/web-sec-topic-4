import { userTable } from '@/lib/db';
import type { ExpressHandler, SessionValidationResult } from '@/lib/types';

export default function meHandler(): ExpressHandler {
	return async (_, res) => {
		const session = res.locals.session as SessionValidationResult;
		if (!session) {
			res.status(401).json({
				code: 'UNAUTHORIZED',
				message: 'Unauthorized',
			});
			return;
		}

		const user = await userTable.select.by.id(session.user.id);
		if (!user) {
			res.status(401).json({
				code: 'UNAUTHORIZED',
				message: 'Unauthorized',
			});
			return;
		}

		res.status(200).json({
			id: user.id,
			username: user.username,
		});
	};
}
