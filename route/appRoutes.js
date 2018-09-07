const Router = require('express').Router;
let router = Router();

const authenticate = require('../middleware/authentication');

const authController = require('../controller/authController');
const supplierController = require('../controller/supplierController');
const inventoryController = require('../controller/inventoryController');
const userController = require('../controller/userController');
const salesController=require('../controller/salesController')

router.use('/auth', authController);
router.use('/inventory', inventoryController);
router.use('/supplier', supplierController);
router.use('/users', authenticate, userController);
router.use('/sales',salesController);

module.exports = router;