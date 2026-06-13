const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Policyholder = sequelize.define('Policyholder', {
    policyholderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId',
        }
    },
    policyNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    coverageType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

User.hasOne(Policyholder, { foreignKey: 'userId' });
Policyholder.belongsTo(User, { foreignKey: 'userId' });

module.exports = Policyholder;
