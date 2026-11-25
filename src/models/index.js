const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');
const Curso = require('./cursoModel');
const Turma = require('./turmaModel');
const Aluno = require('./alunoModel');

Usuario.hasMany(Curso, { foreignKey: 'usuario_id', as: 'cursos' });
Curso.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Curso.hasMany(Turma, { foreignKey: 'curso_id', as: 'turmas' });
Turma.belongsTo(Curso, { foreignKey: 'curso_id', as: 'curso' });

Turma.hasMany(Aluno, { foreignKey: 'turma_id', as: 'alunos' });
Aluno.belongsTo(Turma, { foreignKey: 'turma_id', as: 'turma' });

module.exports = {
  sequelize,
  Usuario,
  Curso,
  Turma,
  Aluno
};