const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define("User", {
    id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fullName:       { type: DataTypes.STRING, allowNull: false },
    username:       { type: DataTypes.STRING, allowNull: false, unique: true },
    email:          { type: DataTypes.STRING, allowNull: false, unique: true },
    password:       { type: DataTypes.STRING, allowNull: false },
    profilePicture: { type: DataTypes.STRING, defaultValue: 'default-profile.png' },
    postsCount:     { type: DataTypes.INTEGER, defaultValue: 0 },
    // Campos Oficiais do Clube
    unidade:        { type: DataTypes.STRING, allowNull: true },
    cargo:          { type: DataTypes.STRING, allowNull: false, defaultValue: 'Desbravador' },
    classes:        { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    isAdmin:        { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {
        timestamps: true,
        tableName: 'users',
        indexes: [
            // Isso resolve o bug do Nodemon! Nomes fixos para os índices únicos.
            { unique: true, fields: ['username'], name: 'idx_unique_username' },
            { unique: true, fields: ['email'], name: 'idx_unique_email' }
        ]
    }
);

module.exports = User;