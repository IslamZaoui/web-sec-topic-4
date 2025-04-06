import { sessionTable, userTable } from '@/lib/db';
import type { SessionValidationResult } from '@/lib/types';
import crypto from 'crypto';

const DEFAULT_EXPIRE = 1000 * 60 * 60 * 24 * 7; // 7 days

export const invalidateSession = async (id: string) => {
	await sessionTable.delete(id);
};

export const invalidateSessions = async (userId: number) => {
	const sessions = await sessionTable.select.all();
	await Promise.all(sessions.map((session) => invalidateSession(session.id)));
};

export const createSession = async (userId: number) => {
	const id = crypto.randomUUID() as string;
	const expiresAt = new Date(Date.now() + DEFAULT_EXPIRE);

	const session = {
		id,
		userId,
		expiresAt,
	};

	await invalidateSessions(userId);
	await sessionTable.create(session);

	return session;
};

export const validateSession = async (id: string): Promise<SessionValidationResult> => {
	const session = await sessionTable.select.by.id(id);
	if (!session) {
		return;
	}

	if (session.expiresAt < new Date()) {
		return;
	}

	const user = await userTable.select.by.id(session.userId);
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
