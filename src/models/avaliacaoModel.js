
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Avaliacao = sequelize.define('Avaliacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  turma_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  data_avaliacao: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('RASCUNHO', 'FINALIZADA'),
    allowNull: false,
    defaultValue: 'RASCUNHO'
  },

  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'avaliacao',
  timestamps: false
});

module.exports = Avaliacao;
