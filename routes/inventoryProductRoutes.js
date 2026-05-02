const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct, updateStock, getLowStockProducts } = require('../controllers/productController');
const { inventoryProtect, inventoryOwnerOnly } = require('../middlewares/inventoryAuthMiddleware');
const { validateProductBody, validateStockUpdateBody } = require('../middlewares/inventoryValidationMiddleware');

router.route('/')
    .get(inventoryProtect, getProducts)
    .post(inventoryProtect, validateProductBody, createProduct);

router.get('/low-stock', inventoryProtect, getLowStockProducts);

router.route('/:id')
    .put(inventoryProtect, validateProductBody, updateProduct)
    .delete(inventoryProtect, inventoryOwnerOnly, deleteProduct);

router.patch('/:id/stock', inventoryProtect, validateStockUpdateBody, updateStock);

module.exports = router;
