export type User = {
	id: number;
	username: string;
	password: string;
};

export type Session = {
	id: string;
	userId: number;
	expiresAt: Date;
};
