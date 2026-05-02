const InventoryUser = require('../models/InventoryUser');

const getInventoryUsers = async (req, res) => {
    try {
        const users = await InventoryUser.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getInventoryUsers };
