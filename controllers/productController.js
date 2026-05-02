const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const { validateProductInput, validateStockUpdateInput } = require('../utils/inventoryValidation');

const normalizeText = (value = '') => String(value).trim().toLowerCase();

const validateSupplierAssignment = async (supplierId, productName) => {
    if (Array.isArray(supplierId)) {
        return { valid: false, message: 'A product can be assigned to only one supplier.' };
    }

    if (!supplierId) {
        return { valid: false, message: 'Supplier is required.' };
    }

    if (!mongoose.Types.ObjectId.isValid(String(supplierId))) {
        return { valid: false, message: 'Supplier id is invalid.' };
    }

    const supplier = await Supplier.findById(supplierId).select('name productName');
    if (!supplier) {
        return { valid: false, message: 'Selected supplier does not exist.' };
    }

    const supplierProductName = normalizeText(supplier.productName);
    const incomingProductName = normalizeText(productName);

    if (supplierProductName && incomingProductName && supplierProductName !== incomingProductName) {
        return {
            valid: false,
            message: `Product ${productName} does not belong to supplier ${supplier.name}.`
        };
    }

    return { valid: true };
};

exports.createProduct = async (req, res) => {
    try {
        // Validate input fields
        const validation = validateProductInput(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }

        const supplierValidation = await validateSupplierAssignment(req.body.supplier, req.body.name);
        if (!supplierValidation.valid) {
            return res.status(400).json({ message: supplierValidation.message });
        }

        const product = await Product.create(req.body);
        await checkAndCreateNotification(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('supplier', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Validate input fields if any are being updated
        const validation = validateProductInput({ ...product.toObject(), ...req.body });
        if (!validation.isValid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }

        if (Object.prototype.hasOwnProperty.call(req.body, 'supplier') || Object.prototype.hasOwnProperty.call(req.body, 'name')) {
            const nextSupplier = Object.prototype.hasOwnProperty.call(req.body, 'supplier') ? req.body.supplier : product.supplier;
            const nextProductName = Object.prototype.hasOwnProperty.call(req.body, 'name') ? req.body.name : product.name;
            const supplierValidation = await validateSupplierAssignment(nextSupplier, nextProductName);
            if (!supplierValidation.valid) {
                return res.status(400).json({ message: supplierValidation.message });
            }
        }

        Object.assign(product, req.body);
        await product.save();
        await checkAndCreateNotification(product);

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Notification.deleteMany({ productId: product._id });

        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { quantity, isDelta } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const oldStatus = product.status;

        if (isDelta) {
            product.quantity += Number(quantity);
        } else {
            product.quantity = Number(quantity);
        }

        await product.save();

        if (product.status !== oldStatus) {
            await checkAndCreateNotification(product, true);
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: { $in: ['LowStock', 'OutOfStock'] } }).populate('supplier', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkAndCreateNotification = async (product, force = false) => {
    if (product.status === 'InStock' && !force) return;

    if (product.status === 'LowStock' || product.status === 'OutOfStock') {
        const message = product.status === 'OutOfStock'
            ? `Product ${product.name} (SKU: ${product.sku}) is Out of Stock.`
            : `Product ${product.name} (SKU: ${product.sku}) is running low on stock (${product.quantity} left).`;

        const existing = await Notification.findOne({ productId: product._id, type: product.status, isRead: false });

        if (!existing) {
            await Notification.create({
                productId: product._id,
                type: product.status,
                message: message
            });
        }
    }
};
