import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
	async register(req, res) {
		try {
			const { username, password } = req.body;

			const isUsed = await User.findOne({ username });

			if (isUsed) {
				return res.status(402).json({
					message: 'Данный пользователь уже существует!',
				});
			}

			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(password, salt);

			const newUser = new User({
				username,
				password: hash,
			});

			await newUser.save();

			res.status(200).json({
				newUser,
				message: 'Регистрация прошла успешно.',
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body;

			const user = await User.findOne({ username });
			if (!user) {
				return res.status(402).json({
					message: 'Данного пользователя не существует.',
				});
			}

			const isPasswordCorrect = await bcrypt.compare(password, user.password);
			if (!isPasswordCorrect) {
				return res.status(402).json({
					message: 'Неверный пароль.',
				});
			}

			const token = jwt.sign(
				{
					id: user._id,
				},
				process.env.JWT_SECRET,
				{ expiresIn: '30d' },
			);

			res.status(200).json({
				token,
				user,
				message: 'Логин подтверждён',
			});
		} catch (err) {
			res.status(500).json(err);
		}
	}

	async getMe(req, res) {
		try {
			const user = await User.findById(req.userId);

			if (!user) {
				return res.status(402).json({
					message: 'Данного пользователя не существует.',
				});
			}

			const token = jwt.sign(
				{
					id: user._id,
				},
				process.env.JWT_SECRET,
				{ expiresIn: '30d' },
			);

			res.status(200).json({
				user,
				token,
			});
		} catch (err) {
			res.status(500).json(err);
		}
	}
}

export default new AuthController();
