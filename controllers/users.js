const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async (req, res) => {
	const { from = 0, limit = 5 } = req.query;
	const query = { condition: true };

	const [total, users] = await Promise.all([
		User.countDocuments(query),
		User.find(query).limit(Number(limit)).skip(Number(from)),
	]);

	res.json({
		total,
		users,
	});
};

const usersPost = async (req, res) => {
	const { name, mail, password, role } = req.body;
	const user = new User({ name, mail, password, role });

	// Encrypt password
	const salt = bcryptjs.genSaltSync();
	user.password = bcryptjs.hashSync(password, salt);

	//Save on DB
	await user.save();

	res.status(201).json({
		user,
	});
};

const usersPut = async (req, res) => {
	const { id } = req.params;
	const { _id, password, google, ...rest } = req.body;

	if (password) {
		// Encrypt password
		const salt = bcryptjs.genSaltSync();
		rest.password = bcryptjs.hashSync(password, salt);
	}

	const user = await User.findByIdAndUpdate(id, rest, {new: true});

	res.json(user);
};	

const usersDelete = async (req, res) => {
	const { id } = req.params;

	const user = await User.findByIdAndUpdate(id, { condition: false }, {new: true});

	res.json({
		user,
	});
};

module.exports = {
	usersGet,
	usersPost,
	usersPut,
	usersDelete,
};
