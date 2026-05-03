const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Post = sequelize.define("Post", {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    images:      { type: DataTypes.JSON, allowNull: false }, // Guardamos os nomes das fotos
    userId:      { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        field: 'user_id', // Alinhado ao banco
        references: { model: 'users', key: 'id' } 
    },
    likesCount:    { type: DataTypes.INTEGER, defaultValue: 0, field: 'likes_count' },
    commentsCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'comments_count' }
}, {
    tableName: "posts",
    timestamps: true,
    underscored: true 
});

module.exports = Post;