import type { ExpressHandler, SessionValidationResult } from '@/lib/types';

export default function homePage(): ExpressHandler {
	return async (_, res) => {
		const session = res.locals.session as SessionValidationResult;

		res.render('home', { user: session?.user });
	};
}
