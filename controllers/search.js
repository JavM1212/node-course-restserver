const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const allowedCollections = ['categories', 'products', 'roles', 'users'];

const searchUsers = async (term = '', res) => {
	const isMongoId = ObjectId.isValid(term);

	if (isMongoId) {
		const user = await User.findById(term);
		return res.json({
			results: user ? [user] : [],
		});
	}

	const regexp = new RegExp(term, 'i');

	const users = await User.find({
		$or: [{ name: regexp }, { mail: regexp }],
		$and: [{ condition: true }],
	});

	const total = await User.count({
		$or: [{ name: regexp }, { mail: regexp }],
		$and: [{ condition: true }],
	});

	res.json({
		total,
		results: users,
	});
};

const searchCategories = async (term = '', res) => {
	const isMongoId = ObjectId.isValid(term);

	if (isMongoId) {
		const category = await Category.findById(term);
		return res.json({
			results: category ? [category] : [],
		});
	}

	const regexp = new RegExp(term, 'i');

	const categories = await Category.find({ name: regexp, condition: true });

	const total = await Category.count({ name: regexp, condition: true });

	res.json({
		total,
		results: categories,
	});
};

const searchProducts = async (term = '', res) => {
	const isMongoId = ObjectId.isValid(term);

	if (isMongoId) {
		const product = await Product.find({
			$or: [{ _id: term }, { category: term }],
			$and: [{ condition: true }],
		}).populate('category', 'name');
		return res.json({
			results: product ? [product] : [],
		});
	}

	const regexp = new RegExp(term, 'i');

	const products = await Product.find({
		$or: [{ name: regexp }, { description: regexp }],
		$and: [{ condition: true }],
	}).populate('category', 'name');

	const total = await Product.count({
		$or: [{ name: regexp }, { description: regexp }],
		$and: [{ condition: true }],
	}).populate('category', 'name');

	res.json({
		total,
		results: products,
	});
};

const search = (req, res) => {
	const { collection, term } = req.params;

	if (!allowedCollections.includes(collection)) {
		return res.status(400).json({
			msg: `Allowed collections are ${allowedCollections}`,
		});
	}

	switch (collection) {
		case 'categories':
			searchCategories(term, res);
			break;
		case 'products':
			searchProducts(term, res);
			break;
		case 'users':
			searchUsers(term, res);
			break;
		default:
			res.status(500).json({
				msg: 'Trolleador cara grupal',
			});
	}
};

module.exports = {
	search,
};
