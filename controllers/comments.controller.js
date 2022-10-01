import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

import console from 'console';

class CommentController {
	async createComment(req, res) {
		try {
			const { postId, comment } = req.body;

			if (!comment) return res.json({ message: 'Комментарий не может быть пустым' });

			const newComment = new Comment({ comment });
			await newComment.save();

			try {
				await Post.findByIdAndUpdate(postId, {
					$push: { comments: newComment._id },
				});
			} catch (error) {
				console.log(error);
			}

			res.json(newComment);
		} catch (err) {
			res.status(500).json(err);
		}
	}
}

export default new CommentController();
