const { Category, Role, User, Product } = require('../models');

const isRoleValid = async (role = '') => {
	const existRole = await Role.findOne({ role });
	if (!existRole) {
		throw new Error(`The role: ${role} is not registered on the data base`);
	}
};

const mailExists = async mail => {
	const emailExists = await User.findOne({ mail });
	if (emailExists) {
		throw new Error('Email is already in use');
	}
};

const existsUserById = async id => {
	const existsUser = await User.findById(id);
	if (!existsUser) {
		throw new Error(`Id does not exists: ${id}`);
	}
};

const existsCategoryById = async id => {
	const existsCategory = await Category.findById(id);
	if (!existsCategory) {
		throw new Error(`${id} does not have a category`);
	}
};

const existsProductById = async id => {
	const existsProduct = await Product.findById(id);
	if (!existsProduct) {
		throw new Error(`${id} does not have a product`);
	}
};

const allowedCollections = (collection = '', collections = []) => {
	const included = collections.includes(collection);
	if (!included) {
		throw new Error(`The collection: ${collection} is not valid. Valid collections are: ${collections}`)
	}

	return true;
};

module.exports = {
	existsUserById,
	existsCategoryById,
	isRoleValid,
	mailExists,
	existsProductById,
	allowedCollections,
};
