
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResultadoCriterio = sequelize.define('ResultadoCriterio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  avaliacao_criterio_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  nota: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false
  },

  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'resultado_criterio',
  timestamps: false
});

module.exports = ResultadoCriterio;
