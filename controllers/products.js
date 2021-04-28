const { request } = require('express');
const { Product } = require('../models');

const getProducts = async (req, res) => {
	const { from = 0, limit = 5 } = req.query;
	const query = { condition: true };

	const [total, products] = await Promise.all([
		Product.countDocuments(query),
		Product.find(query)
			.populate('user', 'name')
			.populate('category', 'name')
			.limit(Number(limit))
			.skip(Number(from)),
	]);

	res.json({
		total,
		products,
	});
};

const getProduct = async (req, res) => {
	const { id } = req.params;

	const product = await Product.findById(id).populate('user', 'name');

	res.json({ product });
};

const createProduct = async (req = request, res) => {
	const { condition, user, ...body } = req.body;

	const productDB = await Product.findOne({ body: body.name });
		
	if (productDB) {
		return res.status(400).json({
			msg: `Product ${productDB.name} allready exists`,
		});
	}

	// Generate data to save
	const data = {
		...body,
		name: body.name.toUpperCase(),
		user: req.user._id,
	};

	const product = new Product(data);

	// Save to DB
	await product.save();

	res.status(201).json(product);
};

const updateProduct = async (req, res) => {
	const { id } = req.params;
	const { condition, user, ...data } = req.body;

	if (data.name) {
		data.name = data.name.toUpperCase();
	}

	data.user = req.user._id;

	const product = await Product.findByIdAndUpdate(id, data, { new: true });

	res.json(product);
};

const deleteProduct = async (req, res) => {
	const { id } = req.params;

	const deletedProduct = await Product.findByIdAndUpdate(id, { condition: false }, { new: true });

	res.json(deletedProduct);
};

module.exports = {
	createProduct,
	deleteProduct,
	getProducts,
	getProduct,
	updateProduct,
};
