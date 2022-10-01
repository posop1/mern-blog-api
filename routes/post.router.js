import { Router } from 'express';
import postController from '../controllers/post.controller.js';
import { checkAuth } from '../utils/checkAuth.js';

const postRouter = new Router();

postRouter.post('/', checkAuth, postController.create);
postRouter.get('/', postController.getAll);
postRouter.get('/:id', postController.getOne);
postRouter.get('/me', checkAuth, postController.getMyPost);
postRouter.put('/:id', checkAuth, postController.update);
postRouter.delete('/:id', checkAuth, postController.delete);
postRouter.get('/comments/:id', postController.getPostComments);

export default postRouter;
