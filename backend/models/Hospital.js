const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Hospital = sequelize.define('Hospital', {
    hospitalId: {
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
    hospitalName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

User.hasOne(Hospital, { foreignKey: 'userId' });
Hospital.belongsTo(User, { foreignKey: 'userId' });

module.exports = Hospital;
