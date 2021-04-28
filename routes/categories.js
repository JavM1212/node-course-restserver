const { Router } = require('express');
const { check } = require('express-validator');

const { existsCategoryById } = require('../helpers/db-validators');

const { validateJWT,
	validateFields,
	isAdminRole
} = require('../middlewares');

const {
	createCategory,
	deleteCategory,
	updateCategory,
	getCategory,
	getCategories,
} = require('../controllers/categories');

const router = Router();

router.get('/', getCategories);

router.get(
	'/:id',
	[
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsCategoryById),
		validateFields,
	],
	getCategory
);

router.post(
	'/',
	[
		validateJWT,
		check('name', 'Name is required').not().isEmpty(),
		validateFields,
	],
	createCategory
);

router.put(
	'/:id',
	[
		validateJWT,
		check('name', 'Name is required').not().isEmpty(),
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsCategoryById),
		validateFields,
	],
	updateCategory
);

router.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsCategoryById),
		validateFields,
	],
	deleteCategory
);

module.exports = router;
