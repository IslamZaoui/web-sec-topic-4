import type { User, Session } from '@/lib/types';
import { Database } from 'bun:sqlite';
import { migrate } from './migration';

export const client = new Database('database.sqlite');

migrate(client);

export const db = {
	user: {
		select: {
			all: () => {
				return client.prepare('SELECT * FROM users').all() as User[];
			},
			by: {
				id: (id: number) =>
					client.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | null,
				username: (username: string) =>
					client
						.prepare('SELECT * FROM users WHERE username = ?')
						.get(username) as User | null,
			},
		},
		delete: {
			by: {
				id: (id: number) => {
					return client.prepare('DELETE FROM users WHERE id = ? returning *').get(id) as User | null;
				},
			},
		},
	},
	session: {
		select: {
			all: () => {
				return client.prepare('SELECT * FROM sessions').all() as Session[];
			},
			allBy: {
				userId: (userId: number) => {
					return client
						.prepare('SELECT * FROM sessions WHERE userId = ?')
						.all(userId) as Session[];
				},
			},
			by: {
				id: (id: string) => {
					return client
						.prepare('SELECT * FROM sessions WHERE id = ?')
						.get(id) as Session | null;
				},
				userId: (userId: number) => {
					return client
						.prepare('SELECT * FROM sessions WHERE userId = ?')
						.get(userId) as Session | null;
				},
			},
		},
		create: (session: Session) => {
			client
				.prepare('INSERT INTO sessions (id, userId, expiresAt) VALUES (?, ?, ?)')
				.run(session.id, session.userId, session.expiresAt.toISOString());
		},
		delete: (id: string) => {
			client.prepare('DELETE FROM sessions WHERE id = ?').run(id);
		},
	},
};
