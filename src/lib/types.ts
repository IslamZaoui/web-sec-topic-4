import type { NextFunction, Request, Response } from 'express';

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

export type SessionValidationResult =
	| (Omit<Session, 'userId'> & { user: Omit<User, 'password'> })
	| undefined;

export type MaybePromise<T> = T | Promise<T>;

export type ExpressMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => MaybePromise<void>;
export type ExpressHandler = (req: Request, res: Response) => MaybePromise<void>;
