const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("../user/userModel"); 

const Post = sequelize.define("Post", 
    {
        id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title:       { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        images:   { type: DataTypes.JSON, allowNull: false },
        likes:       { type: DataTypes.INTEGER, defaultValue: 0 },
        userId:      { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } } 
    }, 
    {
        tableName: "posts",
        timestamps: true,
        indexes: [
            { fields: ['user_id'], name: 'idx_posts_user_id' } // Índice para otimizar a busca
        ]
    }
);

// Define as associações (O relacionamento)
User.hasMany(Post, { foreignKey: "userId" }); // Um desbravador pode ter muitas publicações
Post.belongsTo(User, { foreignKey: "userId" }); // Uma publicação pertence a um desbravador

module.exports = Post;