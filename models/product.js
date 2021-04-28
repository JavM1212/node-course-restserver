const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		unique: true,
	},
	condition: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	price: {
		type: Number,
		default: 0,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	description: { type: String },
	available: { type: Boolean, default: true },
});

ProductSchema.methods.toJSON = function () {
	const { __v, condition, ...data } = this.toObject();
	return data;
};

module.exports = model('Product', ProductSchema);