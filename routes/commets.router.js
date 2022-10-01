import { Router } from 'express';
import { checkAuth } from '../utils/checkAuth.js';
import commentsController from '../controllers/comments.controller.js';

const commentsRouter = new Router();

commentsRouter.post('/:id', checkAuth, commentsController.createComment);

export default commentsRouter;
