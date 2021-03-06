const { Router } = require('express');
const { check } = require('express-validator');

const {
	validateFields,
	validateJWT,
	isAdminRole,
	hasRole,
} = require('../middlewares');

const {
	isRoleValid,
	mailExists,
	existsUserById,
} = require('../helpers/db-validators');

const {
	usersGet,
	usersPost,
	usersPut,
	usersPatch,
	usersDelete,
} = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('password', 'Use a password with 6 or more letters').isLength({
			min: 6,
		}),
		check('mail', 'Mail is not valid').isEmail(),
		check('mail').custom(mailExists),
		check('role').custom(isRoleValid),
		validateFields,
	],
	usersPost
);

router.put(
	'/:id',
	[
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsUserById),
		check('role').custom(isRoleValid),
		validateFields,
	],
	usersPut
);

router.delete(
	'/:id',
	[
		validateJWT,
		// isAdminRole,
		hasRole('ADMIN_ROLE', 'SALES_ROLE'),
		check('id', 'Id is not valid').isMongoId(),
		check('id').custom(existsUserById),
		validateFields,
	],
	usersDelete
);

module.exports = router;
