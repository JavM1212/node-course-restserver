const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req, res, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			msg: 'There is no token in the petition',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Read the user that belongs to the uid
		const user = await User.findById(uid);

        // Verify if user physically exists
        if (!user) {
            return res.status(401).json({
				msg: 'Token not valid',
			});
        }

        // Verify if user has its conditon on true
        if (!user.condition) {
            return res.status(401).json({
                msg: 'Token not valid'
            })
        }

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({
			error,
			msg: 'Token not valid',
		});
	}
};

module.exports = {
	validateJWT,
};
