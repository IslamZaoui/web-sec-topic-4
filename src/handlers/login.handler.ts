import { db } from '@/lib/database';
import { authCookie } from '@/lib/auth/cookie';
import { createSession } from '@/lib/auth/session';
import { rateLimiter } from '@/lib/rate-limiter';
import type { ExpressHandler, User } from '@/lib/types';

export default function loginHandler(): ExpressHandler {
	return async (req, res) => {
		// validate request body
		if (!req.body) {
			res.status(400).json({
				code: 'BAD_REQUEST',
				message: 'Invalid request',
			});
			return;
		}

		// get request body
		const { username, password } = req.body as Omit<User, 'id'>;

		// check if user is rate limited
		const isRateLimited = rateLimiter.check(req, username);

		// block if user is rate limited
		if (isRateLimited) {
			res.status(429).json({
				code: 'RATE_LIMIT_EXCEEDED',
				message: 'Rate limit exceeded',
			});
			return;
		}

		// check if user exists
		const user = db.user.select.by.username(username);
		if (!user) {
			res.status(401).json({
				code: 'INVALID_USERNAME',
				message: 'Invalid username',
			});
			return;
		}
		if (user.password !== password) {
			res.status(401).json({
				code: 'INVALID_PASSWORD',
				message: 'Invalid password',
			});
			return;
		}

		// reset the limiter "the broken brute-force protection here"
		rateLimiter.reset();

		// create session
		const session = createSession(user.id);

		// set session cookie
		authCookie.set(res, session);

		res.status(200).send('OK');
	};
}
