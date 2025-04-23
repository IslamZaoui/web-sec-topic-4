import { client, db } from '@/lib/database';
import type { ExpressHandler } from '@/lib/types';

export default function deleteUserHandler(): ExpressHandler {
	return async (req, res) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({
				code: 'BAD_REQUEST',
				message: 'User ID is required',
			});
			return;
		}

		const userId = parseInt(id);
		if (isNaN(userId)) {
			res.status(400).json({
				code: 'BAD_REQUEST',
				message: 'Invalid user ID',
			});
			return;
		}

		const user = db.user.select.by.id(userId);
		if (!user) {
			res.status(404).json({
				code: 'USER_NOT_FOUND',
				message: 'User not found',
			});
			return;
		}

		// Delete the user
		client.prepare('DELETE FROM users WHERE id = ?').run(userId);
		res.status(200).json({ message: 'User deleted successfully' });
	};
}
