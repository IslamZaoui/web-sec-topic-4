import type { ExpressHandler, SessionValidationResult } from '@/lib/types';

export default function profilePage(): ExpressHandler {
	return async (_, res) => {
		const session = res.locals.session as SessionValidationResult;
		if (!session) {
			res.redirect('/login');
			return;
		}

		res.render('profile', { user: session.user });
	};
}
