import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

class PostController {
	async create(req, res) {
		try {
			const { title, content } = req.body;
			const user = await User.findById(req.userId);

			if (req.files) {
				let fileName = Date.now().toString() + req.files.img.name;
				const __dirname = dirname(fileURLToPath(import.meta.url));
				req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));

				const newPostWithImage = new Post({
					username: user.username,
					title,
					content,
					imageUrl: fileName,
					author: req.userId,
				});

				await newPostWithImage.save();
				await User.findByIdAndUpdate(req.userId, {
					$push: { posts: newPostWithImage },
				});

				return res.status(200).json(newPostWithImage);
			}

			const newPostWithoutImage = new Post({
				username: user.username,
				title,
				content,
				imageUrl: '',
				author: req.userId,
			});
			await newPostWithoutImage.save();
			await User.findByIdAndUpdate(req.userId, {
				$push: { posts: newPostWithoutImage },
			});

			res.status(200).json(newPostWithoutImage);
		} catch (err) {
			res.status(500).json(err);
		}
	}

	async getAll(req, res) {
		try {
			const posts = await Post.find().sort('-createdAt');
			const popularPosts = await Post.find().limit(5).sort('-views');

			if (!posts) {
				return res.json({ message: 'Постов нет' });
			}

			res.status(200).json({ posts, popularPosts });
		} catch (err) {
			res.status(500).json(err);
		}
	}

	async getOne(req, res) {
		try {
			const post = await Post.findByIdAndUpdate(req.params.id, {
				$inc: { views: 1 },
			});
			res.status(200).json(post);
		} catch (err) {
			res.status(500).json(err);
		}
	}

	async getMyPost(req, res) {
		try {
			const user = await User.findById(req.userId);
			const list = await Promise.all(
				user.posts.map((post) => {
					return Post.findById(post._id);
				}),
			);

			res.status(200).json(list);
		} catch (err) {
			res.status(500).json(err);
		}
	}

	async update(req, res) {
		try {
			const { title, text, id } = req.body;
			const post = await Post.findById(id);

			if (req.files) {
				let fileName = Date.now().toString() + req.files.image.name;
				const __dirname = dirname(fileURLToPath(import.meta.url));
				req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));
				post.imgUrl = fileName || '';
			}

			post.title = title;
			post.text = text;

			await post.save();

			res.status(200).json(post);
		} catch (err) {
			res.status(500).json(err);
		}
	}

	async delete(req, res) {
		try {
			const post = await Post.findByIdAndDelete(req.params.id);
			if (!post) return res.json({ message: 'Такого поста не существует' });

			await User.findByIdAndUpdate(req.userId, {
				$pull: { posts: req.params.id },
			});

			res.status(200).json({ message: 'Пост был удален.' });
		} catch (err) {
			res.status(500).json(err);
		}
	}

	async getPostComments(req, res) {
		try {
			const post = await Post.findById(req.params.id);
			const list = await Promise.all(
				post.comments.map((comment) => {
					return Comment.findById(comment);
				}),
			);
			res.json(list);
		} catch (err) {
			res.status(500).json(err);
		}
	}
}

export default new PostController();
