const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Comment = sequelize.define("Comment", {
    id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId:  { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        field: 'user_id', 
        references: { model: 'users', key: 'id' } 
    },
    postId:  { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        field: 'post_id', 
        references: { model: 'posts', key: 'id' } 
    }
}, {
    tableName: "comments",
    timestamps: true,
    underscored: true 
});

module.exports = Comment;