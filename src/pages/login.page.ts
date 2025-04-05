import type { ExpressHandler, SessionValidationResult } from '@/lib/types';

export default function loginPage(): ExpressHandler {
	return async (_, res) => {
		const session = res.locals.session as SessionValidationResult;
		if (session) {
			res.redirect('/');
			return;
		}

		res.render('login');
	};
}
