require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models/index');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco MySQL estabelecida com sucesso!');

    app.listen(PORT, () => {
        console.log(`servidor rodando na porta ${PORT}`);
    });
})
    .catch(err => {
        console.error("Erro crítico ao conectar com o banco de dados:", err);
});