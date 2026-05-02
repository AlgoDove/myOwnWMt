const express = require('express');
const router = express.Router();
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { inventoryProtect, inventoryOwnerOnly } = require('../middlewares/inventoryAuthMiddleware');
const { validateSupplierBody } = require('../middlewares/inventoryValidationMiddleware');

router.route('/')
    .get(inventoryProtect, getSuppliers)
    .post(inventoryProtect, validateSupplierBody, createSupplier);

router.route('/:id')
    .put(inventoryProtect, validateSupplierBody, updateSupplier)
    .delete(inventoryProtect, inventoryOwnerOnly, deleteSupplier);

module.exports = router;
