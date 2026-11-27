const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AvaliacaoCriterio = sequelize.define('AvaliacaoCriterio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  avaliacao_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  criterio_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  tableName: 'avaliacao_criterio',
  timestamps: false
});

module.exports = AvaliacaoCriterio;
