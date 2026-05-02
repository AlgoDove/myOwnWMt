const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const InventoryUser = require('../models/InventoryUser');
const { validateInventoryUserInput } = require('../utils/inventoryValidation');

const generateInventoryToken = (id, role) => {
    return jwt.sign(
        { id, role, scope: 'inventory' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
    );
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (String(password).length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const user = await InventoryUser.findOne({ email: String(email).toLowerCase() });

        if (user && (await bcrypt.compare(password, user.password))) {
            return res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateInventoryToken(user._id, user.role)
            });
        }

        return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        const validation = validateInventoryUserInput({ email, password, name: email, role });
        if (!validation.isValid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }

        const existing = await InventoryUser.findOne({ email: String(email).toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const normalizedRole = role === 'Owner' ? 'Owner' : 'User';
        const user = await InventoryUser.create({
            email: String(email).toLowerCase(),
            password,
            role: normalizedRole
        });

        return res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateInventoryToken(user._id, user.role)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login, register };
