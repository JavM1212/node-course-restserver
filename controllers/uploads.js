const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');

cloudinary.config(process.env.CLOUDINARY_URL);

const loadFile = async (req, res) => {
	try {
		// const name = await uploadFile(req.files, ['txt', 'md', 'png'], 'images');
		const name = await uploadFile(req.files, ['txt', 'md', 'png'], 'imgs');

		res.json({ name });
	} catch (msg) {
		res.status(400).json({
			msg,
		});
	}
};

const updateImgCloudinary = async (req, res) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case 'users':
			model = await User.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `User does not exists: ${id}`,
				});
			}
			break;
		case 'products':
			model = await Product.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `Product does not exists: ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: 'Trolleador cara grupal',
			});
	}

	// Clean previous images
	if (model.img) {
		const nameArr = model.img.split('/');
		const name = nameArr[nameArr.length - 1];
		const [public_id] = name.split('.');

		cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.file;

	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

	model.img = secure_url;

	await model.save();

	res.json(model);
};

const showImage = async (req, res) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case 'users':
			model = await User.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `User does not exists: ${id}`,
				});
			}
			break;
		case 'products':
			model = await Product.findById(id);

			if (!model) {
				return res.status(400).json({
					msg: `Product does not exists: ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: 'Trolleador cara grupal',
			});
	}

	// Clean previous images
	if (model.img) {
		// Delete server image
		const imagePath = path.join(
			__dirname,
			'../uploads',
			collection,
			model.img
		);
		if (fs.existsSync(imagePath)) {
			return res.sendFile(imagePath);
		}
	}

	const imagePath = path.join(__dirname, '../assets/no-image.jpg');
	res.sendFile(imagePath);
};

module.exports = {
	loadFile,
	showImage,
	updateImgCloudinary,
};
