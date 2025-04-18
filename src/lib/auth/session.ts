import { db } from '@/lib/database';
import type { SessionValidationResult } from '@/lib/types';
import crypto from 'crypto';

const DEFAULT_EXPIRE = 1000 * 60 * 60 * 24 * 7; // 7 days

export const invalidateSession = (id: string) => {
	db.session.delete(id);
};

export const invalidateSessions = (userId: number) => {
	const sessions = db.session.select.allBy.userId(userId);
	sessions.map((session) => invalidateSession(session.id));
};

export const createSession = (userId: number) => {
	const id = crypto.randomUUID() as string;
	const expiresAt = new Date(Date.now() + DEFAULT_EXPIRE);

	const session = {
		id,
		userId,
		expiresAt,
	};

	invalidateSessions(userId);
	db.session.create(session);

	return session;
};

export const validateSession = (id: string): SessionValidationResult => {
	const session = db.session.select.by.id(id);
	if (!session) {
		return;
	}

	if (session.expiresAt < new Date()) {
		return;
	}

	const user = db.user.select.by.id(session.userId);
	if (!user) {
		return;
	}

	return {
		id: session.id,
		expiresAt: session.expiresAt,
		user: {
			id: user.id,
			username: user.username,
		},
	};
};
