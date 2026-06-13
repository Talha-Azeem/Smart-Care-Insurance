const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Officer = sequelize.define('Officer', {
    officerId: {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.hasOne(Officer, { foreignKey: 'userId' });
Officer.belongsTo(User, { foreignKey: 'userId' });

module.exports = Officer;
