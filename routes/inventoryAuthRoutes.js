const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/inventoryAuthController');
const { inventoryProtect, inventoryOwnerOnly } = require('../middlewares/inventoryAuthMiddleware');
const { validateInventoryUserBody } = require('../middlewares/inventoryValidationMiddleware');

router.post('/login', login);
router.post('/register', inventoryProtect, inventoryOwnerOnly, validateInventoryUserBody, register);

module.exports = router;
