import express from 'express';
import path from 'path';
import cors from 'cors';
import type { User } from './types';
import { createSession, getUserBy, invalidateSession } from './db';
import { rateLimiter } from './rate-limiter';
import cookieParser from 'cookie-parser';

const app = express()
	.use(express.static(path.resolve(__dirname, 'pages', 'css')))
	.use(express.static(path.resolve(__dirname, 'pages', 'js')))
	.use(express.json())
	.use(cookieParser())
	.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		}),
	)
	.post('/login', async (req, res) => {
		const { username, password } = req.body as Omit<User, 'id'>;

		const requesterID = `${username}-${req.ip || 'unknown'}`;

		const isRateLimited = rateLimiter.check(requesterID);
		if (isRateLimited) {
			res.status(429).json({
				code: 'RATE_LIMIT_EXCEEDED',
				message: 'Rate limit exceeded',
			});
			return;
		}

		const user = await getUserBy.username(username);
		if (!user) {
			res.status(401).json({
				code: 'INVALID_CREDENTIALS',
				message: 'Invalid username or password',
			});
			return;
		}
		if (user.password !== password) {
			res.status(401).json({
				code: 'INVALID_CREDENTIALS',
				message: 'Invalid username or password',
			});
			return;
		}

		rateLimiter.reset();

		const session = await createSession(user.id);
		res.cookie('session', session.id, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			expires: session.expiresAt,
		});

		res.status(200).send('OK');
	})
	.post('/logout', async (req, res) => {
		const sessionId = req.cookies.session;

		if (sessionId) {
			await invalidateSession(sessionId);
		}

		res.clearCookie('session', {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			secure: process.env.NODE_ENV === 'production',
		});

		res.status(200).send('Logged out successfully');
	});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
