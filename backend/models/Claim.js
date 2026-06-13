const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Policyholder = require('./Policyholder');
const Hospital = require('./Hospital');

const Claim = sequelize.define('Claim', {
    claimId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    policyholderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Policyholder,
            key: 'policyholderId',
        }
    },
    hospitalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Hospital,
            key: 'hospitalId',
        }
    },
    treatmentType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    claimAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    documents: {
        type: DataTypes.TEXT, // Store as JSON string of file paths
        allowNull: true,
    },
    fraudScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Valid', 'Invalid', 'Approved', 'Rejected', 'More Info Requested'),
        defaultValue: 'Pending',
    },
    submissionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

Policyholder.hasMany(Claim, { foreignKey: 'policyholderId' });
Claim.belongsTo(Policyholder, { foreignKey: 'policyholderId' });

Hospital.hasMany(Claim, { foreignKey: 'hospitalId' });
Claim.belongsTo(Hospital, { foreignKey: 'hospitalId' });

module.exports = Claim;
