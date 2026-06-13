const Claim = require('../models/Claim');
const Policyholder = require('../models/Policyholder');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { Op } = require('sequelize');

// Fraud Scoring Logic
const calculateFraudScore = async (claimData, policyholderId) => {
    let score = 0;
    const threshold = 100000; // Example threshold

    // 1. Claim amount > threshold = +30 points
    if (claimData.claimAmount > threshold) score += 30;

    // 2. Multiple claims in short time (last 30 days) = +20 points
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    const recentClaims = await Claim.count({
        where: {
            policyholderId,
            submissionDate: { [Op.gte]: thirtyDaysAgo }
        }
    });
    if (recentClaims > 2) score += 20;

    // 3. Missing documents = +20 points (Handled during submission)
    if (!claimData.documents || claimData.documents.length === 0) score += 20;

    // 4. High-risk treatment category = +30 points
    const highRiskTreatments = ['Surgery', 'Critical Care', 'Experimental'];
    if (highRiskTreatments.some(t => claimData.treatmentType.toLowerCase().includes(t.toLowerCase()))) {
        score += 30;
    }

    return score;
};

// Policy Validation Logic
const validatePolicy = async (policyNumber, claimAmount) => {
    const policy = await Policyholder.findOne({ where: { policyNumber } });
    if (!policy) return { valid: false, reason: 'Policy does not exist' };

    const today = new Date();
    if (new Date(policy.expiryDate) < today) return { valid: false, reason: 'Policy expired' };

    // Simple coverage check
    if (policy.coverageType === 'Basic' && claimAmount > 50000) {
        return { valid: false, reason: 'Amount exceeds Basic coverage limit' };
    }

    return { valid: true, policy };
};

exports.submitClaim = async (req, res) => {
    try {
        const { patientCnic, policyNumber, hospitalName, treatmentType, claimAmount, notes } = req.body;
        const files = req.files;

        // Find Policyholder by CNIC or Policy Number
        const policyholder = await Policyholder.findOne({
            include: [{ model: User, where: { cnic: patientCnic } }]
        }) || await Policyholder.findOne({ where: { policyNumber } });

        if (!policyholder) {
            return res.status(404).json({ message: 'Policyholder not found' });
        }

        // Find Hospital (Assuming the logged in user is hospital staff)
        const hospital = await Hospital.findOne({ where: { userId: req.user.userId } });
        if (!hospital) {
            return res.status(403).json({ message: 'Only hospitals can submit claims' });
        }

        // Policy Validation
        const validation = await validatePolicy(policyNumber || policyholder.policyNumber, claimAmount);
        const status = validation.valid ? 'Valid' : 'Invalid';

        // Fraud Scoring
        const documentPaths = files ? files.map(f => f.path) : [];
        const fraudScore = await calculateFraudScore({ claimAmount, treatmentType, documents: documentPaths }, policyholder.policyholderId);

        const claim = await Claim.create({
            policyholderId: policyholder.policyholderId,
            hospitalId: hospital.hospitalId,
            treatmentType,
            claimAmount,
            documents: JSON.stringify(documentPaths),
            fraudScore,
            status,
            notes
        });

        await AuditLog.create({ action: 'Claim Submitted', userId: req.user.userId });
        await Notification.create({
            userId: policyholder.userId,
            message: `Your claim for ${treatmentType} has been submitted by ${hospital.hospitalName}.`
        });

        res.status(201).json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClaims = async (req, res) => {
    try {
        let claims;
        if (req.user.role === 'officer') {
            claims = await Claim.findAll({ include: [Policyholder, Hospital] });
        } else if (req.user.role === 'hospital') {
            const hospital = await Hospital.findOne({ where: { userId: req.user.userId } });
            claims = await Claim.findAll({ where: { hospitalId: hospital.hospitalId }, include: [Policyholder] });
        } else if (req.user.role === 'policyholder') {
            const policyholder = await Policyholder.findOne({ where: { userId: req.user.userId } });
            claims = await Claim.findAll({ where: { policyholderId: policyholder.policyholderId }, include: [Hospital] });
        }
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClaimStatus = async (req, res) => {
    const { id } = req.params;
    const { status, officerNotes } = req.body;

    try {
        const claim = await Claim.findByPk(id, { include: [Policyholder, Hospital] });
        if (!claim) return res.status(404).json({ message: 'Claim not found' });

        claim.status = status;
        if (officerNotes) claim.notes += `\nOfficer Note: ${officerNotes}`;
        await claim.save();

        await AuditLog.create({ action: `Claim ${status}`, userId: req.user.userId });
        
        // Notify both Hospital and Policyholder
        const hospitalUser = await User.findByPk(claim.Hospital.userId);
        const policyholderUser = await User.findByPk(claim.Policyholder.userId);

        await Notification.create({ userId: hospitalUser.userId, message: `Claim ID ${id} has been ${status}.` });
        await Notification.create({ userId: policyholderUser.userId, message: `Your claim ID ${id} has been ${status}.` });

        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
