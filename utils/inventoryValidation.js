// Inventory Validation Utilities

const validateProductInput = (data) => {
    const errors = [];

    // Name validation
    if (!data.name || String(data.name).trim() === '') {
        errors.push('Product name is required and cannot be empty');
    } else if (String(data.name).trim().length < 2) {
        errors.push('Product name must be at least 2 characters long');
    } else if (String(data.name).trim().length > 100) {
        errors.push('Product name cannot exceed 100 characters');
    }

    // SKU validation
    if (!data.sku || String(data.sku).trim() === '') {
        errors.push('SKU is required and cannot be empty');
    } else if (String(data.sku).trim().length < 2) {
        errors.push('SKU must be at least 2 characters long');
    } else if (String(data.sku).trim().length > 50) {
        errors.push('SKU cannot exceed 50 characters');
    }

    // Description validation (optional but if provided)
    if (data.description !== undefined && data.description !== null) {
        if (String(data.description).trim().length > 500) {
            errors.push('Description cannot exceed 500 characters');
        }
    }

    // Category validation (optional but if provided)
    if (data.category !== undefined && data.category !== null) {
        if (String(data.category).trim() === '') {
            errors.push('Category cannot be empty if provided');
        } else if (String(data.category).trim().length > 50) {
            errors.push('Category cannot exceed 50 characters');
        }
    }

    // Price validation
    if (data.price === undefined || data.price === null) {
        errors.push('Price is required');
    } else if (isNaN(Number(data.price))) {
        errors.push('Price must be a valid number');
    } else if (Number(data.price) < 0) {
        errors.push('Price cannot be negative');
    } else if (!isFinite(Number(data.price))) {
        errors.push('Price must be a finite number');
    }

    // Quantity validation
    if (data.quantity === undefined || data.quantity === null) {
        errors.push('Quantity is required');
    } else if (isNaN(Number(data.quantity))) {
        errors.push('Quantity must be a valid number');
    } else if (Number(data.quantity) < 0) {
        errors.push('Quantity cannot be negative');
    } else if (!Number.isInteger(Number(data.quantity))) {
        errors.push('Quantity must be an integer');
    }

    // Reorder Level validation
    if (data.reorderLevel === undefined || data.reorderLevel === null) {
        errors.push('Reorder level is required');
    } else if (isNaN(Number(data.reorderLevel))) {
        errors.push('Reorder level must be a valid number');
    } else if (Number(data.reorderLevel) < 0) {
        errors.push('Reorder level cannot be negative');
    } else if (!Number.isInteger(Number(data.reorderLevel))) {
        errors.push('Reorder level must be an integer');
    }

    // Image URL validation (optional but if provided)
    if (data.imageUrl !== undefined && data.imageUrl !== null && data.imageUrl !== '') {
        if (String(data.imageUrl).trim().length > 500) {
            errors.push('Image URL cannot exceed 500 characters');
        }
    }

    // Status validation (optional but if provided)
    if (data.status !== undefined && data.status !== null) {
        const validStatuses = ['InStock', 'LowStock', 'OutOfStock'];
        if (!validStatuses.includes(data.status)) {
            errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

const validateSupplierInput = (data) => {
    const errors = [];

    // Name validation
    if (!data.name || String(data.name).trim() === '') {
        errors.push('Supplier name is required and cannot be empty');
    } else if (String(data.name).trim().length < 2) {
        errors.push('Supplier name must be at least 2 characters long');
    } else if (String(data.name).trim().length > 100) {
        errors.push('Supplier name cannot exceed 100 characters');
    }

    // Email validation (required)
    if (!data.email || String(data.email).trim() === '') {
        errors.push('Email is required and cannot be empty');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(data.email).trim())) {
            errors.push('Email must be a valid email address');
        }
    }

    // Contact Number validation (required)
    if (!data.contactNumber || String(data.contactNumber).trim() === '') {
        errors.push('Contact number is required and cannot be empty');
    } else {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(String(data.contactNumber).trim())) {
            errors.push('Contact number must be a valid phone number format');
        }
    }

    // Address validation (optional but if provided)
    if (data.address !== undefined && data.address !== null) {
        if (String(data.address).trim().length > 300) {
            errors.push('Address cannot exceed 300 characters');
        }
    }

    // Notes validation (optional but if provided)
    if (data.notes !== undefined && data.notes !== null) {
        if (String(data.notes).trim().length > 500) {
            errors.push('Notes cannot exceed 500 characters');
        }
    }

    // Product Name validation (required)
    if (!data.productName || String(data.productName).trim() === '') {
        errors.push('Product name is required and cannot be empty');
    } else if (String(data.productName).trim().length > 100) {
        errors.push('Product name cannot exceed 100 characters');
    }

    // Product Quantity validation (required, must be > 0)
    if (data.productQuantity === undefined || data.productQuantity === null || data.productQuantity === '') {
        errors.push('Product quantity is required and cannot be empty');
    } else if (isNaN(Number(data.productQuantity))) {
        errors.push('Product quantity must be a valid number');
    } else if (Number(data.productQuantity) <= 0) {
        errors.push('Product quantity must be greater than 0');
    } else if (!Number.isInteger(Number(data.productQuantity))) {
        errors.push('Product quantity must be an integer');
    }

    // Product Price validation (required, must be > 0)
    if (data.productPrice === undefined || data.productPrice === null || data.productPrice === '') {
        errors.push('Product price is required and cannot be empty');
    } else if (isNaN(Number(data.productPrice))) {
        errors.push('Product price must be a valid number');
    } else if (Number(data.productPrice) <= 0) {
        errors.push('Product price must be greater than 0');
    } else if (!isFinite(Number(data.productPrice))) {
        errors.push('Product price must be a finite number');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

const validateStockUpdateInput = (data) => {
    const errors = [];

    // Quantity validation
    if (data.quantity === undefined || data.quantity === null) {
        errors.push('Quantity is required');
    } else if (isNaN(Number(data.quantity))) {
        errors.push('Quantity must be a valid number');
    } else if (Number(data.quantity) < 0) {
        errors.push('Quantity cannot be negative');
    } else if (!Number.isInteger(Number(data.quantity))) {
        errors.push('Quantity must be an integer');
    }

    // isDelta validation (optional but if provided)
    if (data.isDelta !== undefined && data.isDelta !== null) {
        if (typeof data.isDelta !== 'boolean') {
            errors.push('isDelta must be a boolean value');
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

const validateInventoryUserInput = (data) => {
    const errors = [];

    // Email validation
    if (!data.email || String(data.email).trim() === '') {
        errors.push('Email is required and cannot be empty');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(data.email).trim())) {
            errors.push('Email must be a valid email address');
        }
    }

    // Name validation
    if (!data.name || String(data.name).trim() === '') {
        errors.push('Name is required and cannot be empty');
    } else if (String(data.name).trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    } else if (String(data.name).trim().length > 100) {
        errors.push('Name cannot exceed 100 characters');
    }

    // Password validation (required for creation)
    if (data.password !== undefined && data.password !== null) {
        if (String(data.password).length < 6) {
            errors.push('Password must be at least 6 characters long');
        } else if (String(data.password).length > 100) {
            errors.push('Password cannot exceed 100 characters');
        }
    }

    // Role validation (optional but if provided)
    if (data.role !== undefined && data.role !== null) {
        const validRoles = ['admin', 'staff'];
        if (!validRoles.includes(data.role)) {
            errors.push(`Role must be one of: ${validRoles.join(', ')}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

module.exports = {
    validateProductInput,
    validateSupplierInput,
    validateStockUpdateInput,
    validateInventoryUserInput
};
