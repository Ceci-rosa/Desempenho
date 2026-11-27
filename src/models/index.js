
const sequelize = require('../config/database');

const Usuario = require('./usuarioModel');
const Curso = require('./cursoModel');
const Turma = require('./turmaModel');
const Aluno = require('./alunoModel');

// Modelos de avaliação
const Avaliacao = require('./avaliacaoModel');
const CriterioAvaliacao = require('./criterioAvaliacaoModel');
const AvaliacaoCriterio = require('./avaliacaoCriterioModel');
const ResultadoCriterio = require('./resultadoCriterioModel');

// Relacionamentos existentes
Usuario.hasMany(Curso, {
  foreignKey: 'usuario_id',
  as: 'cursos'
});
Curso.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Curso.hasMany(Turma, {
  foreignKey: 'curso_id',
  as: 'turmas'
});
Turma.belongsTo(Curso, {
  foreignKey: 'curso_id',
  as: 'curso'
});

Turma.hasMany(Aluno, {
  foreignKey: 'turma_id',
  as: 'alunos'
});
Aluno.belongsTo(Turma, {
  foreignKey: 'turma_id',
  as: 'turma'
});

// Relacionamentos das avaliações
Turma.hasMany(Avaliacao, {
  foreignKey: 'turma_id',
  as: 'avaliacoes'
});
Avaliacao.belongsTo(Turma, {
  foreignKey: 'turma_id',
  as: 'turma'
});

Usuario.hasMany(Avaliacao, {
  foreignKey: 'usuario_id',
  as: 'avaliacoes'
});
Avaliacao.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Avaliacao.hasMany(AvaliacaoCriterio, {
  foreignKey: 'avaliacao_id',
  as: 'criterios'
});
AvaliacaoCriterio.belongsTo(Avaliacao, {
  foreignKey: 'avaliacao_id',
  as: 'avaliacao'
});

CriterioAvaliacao.hasMany(AvaliacaoCriterio, {
  foreignKey: 'criterio_id',
  as: 'avaliacoes'
});
AvaliacaoCriterio.belongsTo(CriterioAvaliacao, {
  foreignKey: 'criterio_id',
  as: 'criterio'
});

Aluno.hasMany(ResultadoCriterio, {
  foreignKey: 'aluno_id',
  as: 'resultados'
});
ResultadoCriterio.belongsTo(Aluno, {
  foreignKey: 'aluno_id',
  as: 'aluno'
});

AvaliacaoCriterio.hasMany(ResultadoCriterio, {
  foreignKey: 'avaliacao_criterio_id',
  as: 'resultados'
});
ResultadoCriterio.belongsTo(AvaliacaoCriterio, {
  foreignKey: 'avaliacao_criterio_id',
  as: 'avaliacaoCriterio'
});

module.exports = {
  sequelize,
  Usuario,
  Curso,
  Turma,
  Aluno,
  Avaliacao,
  CriterioAvaliacao,
  AvaliacaoCriterio,
  ResultadoCriterio
};
