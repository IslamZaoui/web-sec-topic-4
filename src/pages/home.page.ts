import { db } from '@/lib/database';
import type { ExpressHandler, SessionValidationResult } from '@/lib/types';

export default function homePage(): ExpressHandler {
	return async (_, res) => {
		const session = res.locals.session as SessionValidationResult;
		const isCarlosDeleted = !!!db.user.select.by.username('carlos');

		res.render('home', { user: session?.user, isCarlosDeleted });
	};
}
