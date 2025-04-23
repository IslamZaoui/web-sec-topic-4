import type { ExpressMiddleware } from '@/lib/types';

export default function originalUrlMiddleware(): ExpressMiddleware {
	return (req, _, next) => {
		// get the original url from the x-original-url header
		const originalUrl = req.headers['x-original-url'];

		// if the original url is present, set the url to the original url
		if (originalUrl) {
			req.url = originalUrl as string;
		}

		next();
	};
}
