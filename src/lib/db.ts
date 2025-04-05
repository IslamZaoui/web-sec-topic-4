import type { Session, User } from './types';

const BASE_PATH = `${process.cwd()}/db`;

async function readJsonFile<T>(filePath: string): Promise<T[]> {
	return (await Bun.file(filePath).json()) as T[];
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
	await Bun.write(filePath, JSON.stringify(data));
}

export const userTable = {
	select: {
		all: async () => readJsonFile<User>(`${BASE_PATH}/users.json`),
		by: {
			id: async (id: number) => {
				const users = await userTable.select.all();
				return users.find((user) => user.id === id);
			},
			username: async (username: string) => {
				const users = await userTable.select.all();
				return users.find((user) => user.username === username);
			},
		},
	},
};

export const sessionTable = {
	select: {
		all: async () => readJsonFile<Session>(`${BASE_PATH}/sessions.json`),
		allBy: {
			userId: async (userId: number) => {
				const sessions = await sessionTable.select.all();
				return sessions.filter((session) => session.userId === userId);
			},
		},
		by: {
			id: async (id: string) => {
				const sessions = await sessionTable.select.all();
				return sessions.find((session) => session.id === id);
			},
			userId: async (userId: number) => {
				const sessions = await sessionTable.select.all();
				return sessions.find((session) => session.userId === userId);
			},
		},
	},
	create: async (session: Session) => {
		const sessions = await sessionTable.select.all();
		sessions.push(session);
		await writeJsonFile('db/sessions.json', sessions);
	},
	delete: async (id: string) => {
		const sessions = await sessionTable.select.all();
		const updatedSessions = sessions.filter((session) => session.id !== id);
		await writeJsonFile('db/sessions.json', updatedSessions);
	},
};
