import { db } from '@/lib/database';
import type { ExpressHandler } from '@/lib/types';

export default function adminPage(): ExpressHandler {
	return async (_, res) => {
		const users = db.user.select.all();

		res.render('admin', { users });
	};
}
