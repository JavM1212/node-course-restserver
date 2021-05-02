const { Router } = require('express');
const { check } = require('express-validator');

const { loadFile, updateImgCloudinary, showImage } = require('../controllers/uploads');
const { validateFields, validateJWT, validateFile } = require('../middlewares');
const { allowedCollections } = require('../helpers')

const router = Router();

router.get('/:collection/:id', [
    validateJWT,
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields], showImage);

router.post('/', [
    validateJWT,
    validateFile,
    validateFields
], loadFile);

router.put('/:collection/:id', [
    validateJWT,
    validateFile,
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImgCloudinary)

module.exports = router;
