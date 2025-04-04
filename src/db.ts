import crypto from 'crypto';
import type { Session, User } from './types';

const BASE_PATH = `${process.cwd()}/db`;

const userTable = {
	selectAll: async () => {
		return (await Bun.file(`${BASE_PATH}/users.json`).json()) as User[];
	},
};

const sessionTable = {
	selectAll: async () => {
		return (await Bun.file(`${BASE_PATH}/sessions.json`).json()) as Session[];
	},
	create: async (session: Session) => {
		await Bun.write('db/sessions.json', JSON.stringify([...(await sessionTable.selectAll()), session]));
	},
	delete: async (id: string) => {
		await Bun.write(
			'db/sessions.json',
			JSON.stringify((await sessionTable.selectAll()).filter((session) => session.id !== id)),
		);
	},
};

export const getUserBy = {
	username: async (username: string) => {
		const users = await userTable.selectAll();
		return users.find((user) => user.username === username);
	},
	id: async (id: number) => {
		const users = await userTable.selectAll();
		return users.find((user) => user.id === id);
	},
};

export const invalidateSession = async (id: string) => {
	await sessionTable.delete(id);
};

const invalidateSessions = async (userId: number) => {
	const sessions = (await sessionTable.selectAll()).filter((session) => session.userId === userId);
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
