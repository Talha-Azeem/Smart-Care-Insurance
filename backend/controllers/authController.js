const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Policyholder = require('../models/Policyholder');
const Hospital = require('../models/Hospital');
const Officer = require('../models/Officer');
const AuditLog = require('../models/AuditLog');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { name, email, password, role, cnic, phone } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            cnic,
            phone
        });

        // Create role-specific records if needed
        if (role === 'policyholder') {
            await Policyholder.create({
                userId: user.userId,
                policyNumber: 'POL' + Math.floor(Math.random() * 1000000), // Placeholder
                coverageType: 'Basic', // Default
                expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            });
        } else if (role === 'hospital') {
            await Hospital.create({
                userId: user.userId,
                hospitalName: name,
                registrationNumber: 'REG' + Math.floor(Math.random() * 100000)
            });
        } else if (role === 'officer') {
            await Officer.create({
                userId: user.userId,
                name: user.name,
                designation: 'Insurance Officer'
            });
        }

        await AuditLog.create({
            action: 'User Registered',
            userId: user.userId
        });

        res.status(201).json({
            message: 'User registered successfully',
            token: generateToken(user.userId)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user.userId);
            
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            await AuditLog.create({
                action: 'User Logged In',
                userId: user.userId
            });

            res.json({
                userId: user.userId,
                name: user.name,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
    const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password'] }
    });
    res.json(user);
};
