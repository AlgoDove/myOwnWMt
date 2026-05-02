// Inventory Validation Middleware

const { 
    validateProductInput, 
    validateSupplierInput, 
    validateStockUpdateInput,
    validateInventoryUserInput
} = require('../utils/inventoryValidation');

const validateProductBody = (req, res, next) => {
    const validation = validateProductInput(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: validation.errors 
        });
    }
    next();
};

const validateSupplierBody = (req, res, next) => {
    const validation = validateSupplierInput(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: validation.errors 
        });
    }
    next();
};

const validateStockUpdateBody = (req, res, next) => {
    const validation = validateStockUpdateInput(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: validation.errors 
        });
    }
    next();
};

const validateInventoryUserBody = (req, res, next) => {
    const validation = validateInventoryUserInput(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: validation.errors 
        });
    }
    next();
};

module.exports = {
    validateProductBody,
    validateSupplierBody,
    validateStockUpdateBody,
    validateInventoryUserBody
};
