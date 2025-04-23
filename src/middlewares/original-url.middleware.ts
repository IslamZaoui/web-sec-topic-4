import type { ExpressMiddleware } from '@/lib/types';

export default function originalUrlMiddleware(): ExpressMiddleware {
	return (req, _, next) => {
		const originalUrl = req.headers['x-original-url'];
		if (originalUrl) {
			req.url = originalUrl as string;
		}
		next();
	};
}
