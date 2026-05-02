const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { inventoryProtect } = require('../middlewares/inventoryAuthMiddleware');

router.route('/')
    .get(inventoryProtect, getNotifications);

router.patch('/read-all', inventoryProtect, markAllAsRead);
router.patch('/:id/read', inventoryProtect, markAsRead);

module.exports = router;
