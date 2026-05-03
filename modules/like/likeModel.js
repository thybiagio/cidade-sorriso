const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Like = sequelize.define("Like", { 
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
    postId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "posts", key: "id" } }
}, 
{ 
    tableName: "likes",
    timestamps: true,
    indexes: [{ fields: ['userId', 'postId'], unique: true, name: 'idx_unique_user_post_like' }]
});

module.exports = Like;