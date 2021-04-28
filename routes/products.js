const { Router } = require('express');
const { check } = require('express-validator');

const {
	existsCategoryById,
	existsProductById,
} = require('../helpers/db-validators');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const {
	createProduct,
	getProducts,
	deleteProduct,
	updateProduct,
	getProduct,
} = require('../controllers/products');

const router = Router();

router.get('/', getProducts);

router.get(
	'/:id',
	[
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsProductById),
		validateFields,
	],
	getProduct
);

router.post(
	'/',
	[
		validateJWT,
		check('name', 'Name is required').not().isEmpty(),
		check('category', 'Category is required').not().isEmpty(),
		check('category', 'Id is not valid').isMongoId(),
		check('category').custom(existsCategoryById),
		validateFields,
	],
	createProduct
);

router.put(
	'/:id',
	[
		validateJWT,
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsProductById),
		validateFields,
	],
	updateProduct
);

router.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsProductById),
		validateFields,
	],
	deleteProduct
);

module.exports = router;
