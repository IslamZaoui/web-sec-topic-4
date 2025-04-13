import express from 'express';
import path from 'path';
import cors from 'cors';

import authMiddleware from '@/middlewares/auth.middleware';

import loginHandler from '@/handlers/login.handler';
import logoutHandler from '@/handlers/logout.handler';

import homePage from '@/pages/home.page';
import loginPage from '@/pages/login.page';
import profilePage from '@/pages/profile.page';

const app = express();

// middlewares
app.use(express.static(path.resolve(__dirname, 'static')))
	.set('views', path.resolve(__dirname, 'views'))
	.set('view engine', 'ejs')
	.use(authMiddleware())
	.use(express.json())
	.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		}),
	);

// handlers
app.post('/api/login', loginHandler()).post('/api/logout', logoutHandler());

// server rendered pages
app.get('/', homePage()).get('/login', loginPage()).get('/profile', profilePage());

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
