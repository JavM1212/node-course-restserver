const { response, request } = require('express');

const usersGet = (req = request, res = response) => {
    const { q, name = "no name", apikey, page = 1, limit } = req.query;

	res.json({
		msg: 'get API - Controller',
		q,
		name,
        apikey,
        page,
        limit
	});
};

const usersPost = (req, res) => {
	const { nombre, edad, id, ciudad } = req.body;

	res.status(201).json({
		msg: 'post API - Controller',
		name,
		age,
		id,
		city,
	});
};

const usersPut = (req, res) => {
	const { id } = req.params;

	res.status(500).json({
		msg: 'put API - Controller',
		id,
	});
};

const usersPatch = (req, res) => {
	res.json({
		msg: 'patch API',
	});
};

const usersDelete = (req, res) => {
	res.json({
		msg: 'delete API',
	});
};

module.exports = {
	usersGet,
	usersPost,
	usersPut,
	usersPatch,
	usersDelete,
};
