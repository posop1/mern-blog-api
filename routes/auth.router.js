import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { checkAuth } from '../utils/checkAuth.js';

const authRouter = new Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/profile', checkAuth, authController.getMe);

export default authRouter;
