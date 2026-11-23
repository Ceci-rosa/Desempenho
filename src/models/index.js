const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');
const Curso = require('./cursoModel');

// Definindo Associações (Relacionamentos)
Usuario.hasMany(Curso, { foreignKey: 'usuario_id', as: 'cursos' });
Curso.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = {
  sequelize,
  Usuario,
  Curso
};