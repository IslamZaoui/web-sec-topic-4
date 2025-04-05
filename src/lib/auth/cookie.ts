import { getCookie } from '@/helpers/cookie';
import type { Request, Response } from 'express';
import type { Session } from '@/lib/types';

const SESSION_NAME = 'sessionToken';

export const authCookie = {
	get: (req: Request) => getCookie(req, SESSION_NAME),
	set: (res: Response, session: Session) => {
		res.cookie(SESSION_NAME, session.id, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			expires: session.expiresAt,
		});
	},
	clear: (res: Response) => {
		res.clearCookie(SESSION_NAME);
	},
};
