const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, authorize('officer'), getAuditLogs);

module.exports = router;
