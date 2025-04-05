import { sessionTable, userTable } from '@/lib/db';
import type { SessionValidationResult } from '@/lib/types';
import crypto from 'crypto';

export const invalidateSession = async (id: string) => {
	await sessionTable.delete(id);
};

export const invalidateSessions = async (userId: number) => {
	const sessions = await sessionTable.select.all();
	await Promise.all(sessions.map((session) => invalidateSession(session.id)));
};

export const createSession = async (userId: number) => {
	const id = crypto.randomUUID() as string;
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

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
