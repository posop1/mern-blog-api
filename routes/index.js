import { Router } from 'express';
import postRouter from './post.router.js';
import authRouter from './auth.router.js';
import commentsRouter from './commets.router.js';

const routers = new Router();

routers.use('/post', postRouter);
routers.use('/user', authRouter);
routers.use('/comments', commentsRouter);

export default routers;
