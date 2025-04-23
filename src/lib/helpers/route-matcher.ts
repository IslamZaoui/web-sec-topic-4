import type { Request } from 'express';

export default function createRouteMatcher(paths: string[]) {
	return (request: Request): boolean => {
		for (const path of paths) {
			const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\*', '.*');
			const regex = new RegExp(`^${escapedPath}`);
			if (regex.test(request.originalUrl)) {
				return true;
			}
		}
		return false;
	};
}
