
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CriterioAvaliacao = sequelize.define('CriterioAvaliacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  nota_min: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    defaultValue: 0.00
  },

  nota_max: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    defaultValue: 10.00
  },

  peso: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    defaultValue: 1.00
  },

  status: {
    type: DataTypes.ENUM('ATIVO', 'INATIVO'),
    allowNull: false,
    defaultValue: 'ATIVO'
  }

}, {
  tableName: 'criterio_avaliacao',
  timestamps: false
});

module.exports = CriterioAvaliacao;
