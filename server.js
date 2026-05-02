require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedData = require('./utils/seeder');

// Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ruleRoutes = require('./routes/ruleRoutes');
const userRoutes = require('./routes/userRoutes');
const inventoryAuthRoutes = require('./routes/inventoryAuthRoutes');
const inventoryUserRoutes = require('./routes/inventoryUserRoutes');
const inventoryProductRoutes = require('./routes/inventoryProductRoutes');
const inventorySupplierRoutes = require('./routes/inventorySupplierRoutes');
const inventoryNotificationRoutes = require('./routes/inventoryNotificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory/auth', inventoryAuthRoutes);
app.use('/api/inventory/users', inventoryUserRoutes);
app.use('/api/inventory/products', inventoryProductRoutes);
app.use('/api/inventory/suppliers', inventorySupplierRoutes);
app.use('/api/inventory/notifications', inventoryNotificationRoutes);

// Database and Server
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    console.log('MongoDB connected');
    await seedData(); // Seed on startup
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
});
