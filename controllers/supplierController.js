const Supplier = require('../models/Supplier');
const { validateSupplierInput } = require('../utils/inventoryValidation');

exports.createSupplier = async (req, res) => {
    try {
        // Validate input fields
        const validation = validateSupplierInput(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }

        const supplier = await Supplier.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        // Validate input fields if any are being updated
        const validation = validateSupplierInput({ ...supplier.toObject(), ...req.body });
        if (!validation.isValid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }

        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json({ message: 'Supplier removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
