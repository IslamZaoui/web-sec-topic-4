import { db } from '@/lib/database';
import type { ExpressHandler, SessionValidationResult } from '@/lib/types';

export default function adminPage(): ExpressHandler {
	return async (_, res) => {
		const session = res.locals.session as SessionValidationResult;
		if (!session) {
			res.redirect('/login');
			return;
		}

		const users = db.user.select.all();
		res.render('admin', { users });
	};
}
