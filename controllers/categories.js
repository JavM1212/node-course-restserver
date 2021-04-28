const { Category } = require('../models');

const getCategories = async (req, res) => {
	const { from = 0, limit = 5 } = req.query;
	const query = { condition: true };

	const [total, categories] = await Promise.all([
		Category.countDocuments(query),
		Category.find(query)
			.populate('user', 'name')
			.limit(Number(limit))
			.skip(Number(from)),
	]);

	res.json({
		total,
		categories,
	});
};

const getCategory = async (req, res) => {
	const { id } = req.params;

	const category = await Category.findById(id).populate('user', 'name');

	res.json({ category });
};

const createCategory = async (req, res) => {
	const name = req.body.name.toUpperCase();

	const categoryDB = await Category.findOne({ name });

	if (categoryDB) {
		return res.status(400).json({
			msg: `Category ${categoryDB.name} allready exists`,
		});
	}

	// Generate data to save
	const data = {
		name,
		user: req.user._id,
	};

	const category = new Category(data);

	// Save to DB
	await category.save();

	res.status(201).json(category);
};

const updateCategory = async (req, res) => {
	const { id } = req.params;
	const { condition, user, ...data } = req.body;

	data.name = data.name.toUpperCase();
	data.user = req.user._id;

	const category = await Category.findByIdAndUpdate(id, data, {new: true});

	res.json(category);
};

const deleteCategory = async (req, res) => {
	const { id } = req.params;

	const deletedCategory = await Category.findByIdAndUpdate(id, { condition: false }, {new: true});

	res.json({
		deletedCategory,
	});
};

module.exports = {
	createCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
};
