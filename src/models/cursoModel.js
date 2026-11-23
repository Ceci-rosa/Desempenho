const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define('Curso', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'curso',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: false
});

module.exports = Curso;