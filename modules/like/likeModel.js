const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Like = sequelize.define("Like", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        field: 'user_id', 
        references: { model: "users", key: "id" } 
    },
    postId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        field: 'post_id', 
        references: { model: "posts", key: "id" } 
    }
}, {
    tableName: "likes",
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id', 'post_id'], unique: true, name: 'idx_unique_like' }
    ]
});

module.exports = Like;