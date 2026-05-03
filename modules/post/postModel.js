const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Post = sequelize.define("Post", 
    {
        id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title:       { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        images:      { type: DataTypes.JSON, allowNull: false }, 
        likes:       { type: DataTypes.INTEGER, defaultValue: 0 },
        userId:      { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
        likesCount:  { type: DataTypes.INTEGER, defaultValue: 0 }, 
        commentsCount: { type: DataTypes.INTEGER, defaultValue: 0 }

    }, 
    {
        tableName: "posts",
        timestamps: true,
        indexes: [{ fields: ['user_id'], name: 'idx_posts_user_id' }]
    }
);

module.exports = Post;