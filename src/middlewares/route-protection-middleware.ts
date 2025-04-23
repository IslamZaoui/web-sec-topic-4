import createRouteMatcher from '@/lib/helpers/route-matcher';
import type { ExpressMiddleware, SessionValidationResult } from '@/lib/types';

const guestRoutes = createRouteMatcher(['/login', '/api/login']);
const adminRoutes = createRouteMatcher(['/admin', '/api/users/*']);
const userRoutes = createRouteMatcher(['/profile', '/api/logout']);

export default function routeProtectionMiddleware(): ExpressMiddleware {
	return (req, res, next) => {
		const session = res.locals.session as SessionValidationResult;
		const isAuthenticated = !!session;

		// Block access to admin routes for everyone
		if (adminRoutes(req)) {
			res.status(403).send('Access denied');
			return;
		}

		// Handle guest routes
		if (guestRoutes(req)) {
			if (isAuthenticated) {
				res.redirect('/');
				return;
			}
			return next();
		}

		// Handle protected user routes
		if (userRoutes(req)) {
			if (!isAuthenticated) {
				res.redirect('/login');
				return;
			}
			return next();
		}

		// Allow access to public routes
		next();
	};
}
