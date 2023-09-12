const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', 'nova_senha', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    sequelize.authenticate();
    console.log("Conectou ao banco com sucesso!");
} catch(error) {
    console.log("Ocorreu um erro ao conectar ao banco:", error);
}

module.exports = sequelize;