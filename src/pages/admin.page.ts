import { db } from '@/lib/database';
import type { ExpressHandler } from '@/lib/types';

function deleteUser(id: number) {
	try {
		const deletedUser = db.user.delete.by.id(id);
		if (!deletedUser) {
			return ['', 'User not found'];
		}
		return [`User ${deletedUser.username} deleted successfully`, ''];
	} catch (err) {
		return ['', 'Failed to delete user. Please try again.'];
	}
}

export default function adminPage(): ExpressHandler {
	return async (req, res) => {
		let message = undefined;
		let error = undefined;

		const user2delete = req.query['delete-user'];
		if (user2delete && typeof user2delete === 'string') {
			[message, error] = deleteUser(parseInt(user2delete));
		}

		const users = db.user.select.all();

		res.render('admin', { users, message, error });
	};
}
