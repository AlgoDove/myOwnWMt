const jwt = require('jsonwebtoken');

const inventoryProtect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            if (decoded.scope !== 'inventory') {
                return res.status(403).json({ message: 'Invalid token scope' });
            }

            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const inventoryOwnerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Owner') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Owner only.' });
};

module.exports = { inventoryProtect, inventoryOwnerOnly };
