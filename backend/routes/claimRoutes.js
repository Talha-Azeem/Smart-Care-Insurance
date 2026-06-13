const express = require('express');
const { submitClaim, getClaims, updateClaimStatus } = require('../controllers/claimController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/', protect, authorize('hospital'), upload.array('documents', 5), submitClaim);
router.get('/', protect, getClaims);
router.put('/:id', protect, authorize('officer'), updateClaimStatus);

module.exports = router;
