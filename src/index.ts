import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authMiddleware from '@/middlewares/auth.middleware';
import loginHandler from '@/handlers/login.handler';
import logoutHandler from './handlers/logout.handler';
import meHandler from '@/handlers/me.handler';
import homePage from '@/pages/home.page';
import loginPage from '@/pages/login.page';
import profilePage from '@/pages/profile.page';

const app = express();

app.use(express.static(path.resolve(__dirname, 'static')))
	.set('views', path.resolve(__dirname, 'views'))
	.set('view engine', 'ejs')
	.use(authMiddleware())
	.use(express.json())
	.use(cookieParser())
	.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		}),
	);

app.post('/api/login', loginHandler())
	.post('/api/logout', logoutHandler())
	.get('/api/me', meHandler());

app.get('/', homePage()).get('/login', loginPage()).get('/profile', profilePage());

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
