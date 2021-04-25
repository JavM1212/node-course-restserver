const bcryptjs = require('bcryptjs');

const { generateJwt } = require('../helpers/generate-jwt');
const User = require('../models/user');

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

module.exports = {
	login,
};
