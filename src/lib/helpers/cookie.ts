import { parse } from 'cookie-es';
import type { Request } from 'express';

export function getCookie(req: Request, name: string) {
	const cookies = parse(req.headers.cookie || '');
	return cookies[name];
}
