import type { ExpressHandler } from '@/lib/types';

export default function loginPage(): ExpressHandler {
	return async (_, res) => {
		res.render('login');
	};
}
