const express = require('express');
const router = express.Router();
const { getInventoryUsers } = require('../controllers/inventoryUserController');
const { inventoryProtect, inventoryOwnerOnly } = require('../middlewares/inventoryAuthMiddleware');

router.get('/', inventoryProtect, inventoryOwnerOnly, getInventoryUsers);

module.exports = router;
