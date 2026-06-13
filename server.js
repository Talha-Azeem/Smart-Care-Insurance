const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const { connectDB, sequelize } = require('./backend/config/db');

// Import models to ensure they are registered with Sequelize
const User = require('./backend/models/User');
const Policyholder = require('./backend/models/Policyholder');
const Hospital = require('./backend/models/Hospital');
const Officer = require('./backend/models/Officer');
const Claim = require('./backend/models/Claim');
const Notification = require('./backend/models/Notification');
const AuditLog = require('./backend/models/AuditLog');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5000', // Update this if frontend is served elsewhere
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

// Routes
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/claims', require('./backend/routes/claimRoutes'));
app.use('/api/notifications', require('./backend/routes/notificationRoutes'));
app.use('/api/auditlogs', require('./backend/routes/auditRoutes'));

// Database Connection and Sync
connectDB();
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Error syncing database:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
