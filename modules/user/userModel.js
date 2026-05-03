const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('User',
    {
        id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username:       { type: DataTypes.STRING, allowNull: false, unique: 'idx_unique_username' },
        email:          { type: DataTypes.STRING, allowNull: false, unique: 'idx_unique_email', validate: { isEmail: true } },
        password:       { type: DataTypes.STRING, allowNull: false },
        fullName:       { type: DataTypes.STRING, allowNull: true },
        bio:            { type: DataTypes.STRING(255), allowNull: true },
        unidade:        { type: DataTypes.STRING, allowNull: true },
        classes:        { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
        cargo:          { type: DataTypes.STRING, allowNull: false, defaultValue: 'Desbravador' },
        dataNascimento: { type: DataTypes.DATEONLY, allowNull: true },
        profilePicture: { type: DataTypes.STRING, allowNull: true, defaultValue: 'default-profile.png' },
        postsCount:     { type: DataTypes.INTEGER, defaultValue: 0 }, // Novo: Contador de publicações
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