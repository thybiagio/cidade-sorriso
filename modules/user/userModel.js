const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define("User", {
    id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fullName:       { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
    username:       { type: DataTypes.STRING, allowNull: false, unique: true },
    email:          { type: DataTypes.STRING, allowNull: false, unique: true },
    password:       { type: DataTypes.STRING, allowNull: false },
    profilePicture: { type: DataTypes.STRING, defaultValue: 'default-profile.png', field: 'profile_picture' },
    
    // ATRIBUIÇÕES FIXAS (Gerenciadas pelo ADM)
    unidade: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    cargoClube: { 
        type: DataTypes.STRING, 
        defaultValue: 'Desbravador',
        field: 'cargo_clube' 
    },
    cargoUnidade: { 
        type: DataTypes.STRING, 
        defaultValue: 'Nenhum',
        field: 'cargo_unidade' 
    },
    classesConcluidas: { 
        type: DataTypes.JSON, 
        defaultValue: [],
        field: 'classes_concluidas' 
    },
    
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_admin' }
}, {
    tableName: "users",
    timestamps: true,
    underscored: true // Isso ajuda a manter o padrão do banco (snake_case)
});

module.exports = User;