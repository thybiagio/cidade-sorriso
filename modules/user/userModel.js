const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define(
    'User', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullname: { 
            type: DataTypes.STRING,
            allowNull: true
        },
        bio: { 
            type: DataTypes.STRING(255),
            allowNull: true
        },
        profilePicture: { 
            type: DataTypes.BOOLEAN,
            deafultValue: false
        },
        isAdmin: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
    { 
        timestamps: true, 
        tableName: 'users'
    }
);

module.exports = User;