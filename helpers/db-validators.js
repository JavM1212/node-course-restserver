const Role = require('../models/role');
const User = require('../models/user');

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

module.exports = {
	isRoleValid,
	mailExists,
	existsUserById,
};
