// 1. Carrega os modelos
const User = require('../modules/user/userModel');
const Post = require('../modules/post/postModel'); 

// 2. Descreve as associações 
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });