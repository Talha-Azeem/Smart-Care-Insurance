const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            include: [{ model: User, attributes: ['name', 'role'] }],
            order: [['timestamp', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
