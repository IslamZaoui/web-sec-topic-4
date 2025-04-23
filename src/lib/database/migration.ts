import { client } from './index';
import type { Database } from 'better-sqlite3';

export function migrate(db: Database) {
	// Create users table
	db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

	// Create sessions table
	db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      userId INTEGER NOT NULL,
      expiresAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

	// Insert initial users if they don't exist
	const users = [
		{ id: 1, username: 'wiener', password: 'peter' },
		{ id: 2, username: 'carlos', password: 'ginger' },
	];

	const insertUser = client.prepare(
		'INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, ?)',
	);
	users.forEach((user) => {
		insertUser.run(user.id, user.username, user.password);
	});

	console.log('Users inserted successfully');
}
