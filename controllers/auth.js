const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generateJwt } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {
	const { mail, password } = req.body;

	try {
		const user = await User.findOne({ mail });

		// Verify if mail exists
		if (!user) {
			return res.status(400).json({
				msg: 'User / Password are not correct - mail',
			});
		}

		// Verify if user is active
		if (!user.condition) {
			return res.status(400).json({
				msg: 'User / Password are not correct - condition: false',
			});
		}

		// Verify password
		const validPassword = bcryptjs.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'User / Password are not correct - password',
			});
		}

		// Generate JWT
		const token = await generateJwt(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		res.status(500).json({
			error,
			msg: 'Something went wrong',
		});
	}
};

const googleSignin = async (req, res) => {
	const { id_token } = req.body;

	try {
		const { mail, name, img } = await googleVerify(id_token);

		let user = await User.findOne({mail});

		if (!user) {
			// Create one
			const data = {
				name,
				mail,
				password: ':P',
				img,
				google: true,
			};

			user = new User(data);
			await user.save();
		}

		// Check if user is in DB
		if (!user.condition) {
			return res.status(401).json({
				msg: 'Talk to the admin, user blocked',
			});
		}

		// Generate JWT
		const token = await generateJwt(user.id);

		res.json({
			user,
			token
		});
	} catch (error) {
		res.status(400).json({
			msg: 'Google token not valid',
		});
	}
};

module.exports = {
	login,
	googleSignin,
};
