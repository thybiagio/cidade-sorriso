const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    { 
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb',
        logging: false,
        define: { 
            timestamps: true, //cria os campos createdAt e updatedAt automaticamente
            underscored: true //usa a forma created_at e updated_at
    
        }
    }
);

module.exports = sequelize;