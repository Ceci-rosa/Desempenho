const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aluno = sequelize.define('Aluno', {
  turma_id: { type: DataTypes.INTEGER, allowNull: false },
  nome: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: true },
  telefone: { type: DataTypes.STRING(25), allowNull: true },
  data_nascimento: { type: DataTypes.DATEONLY, allowNull: true },
  codigo_aluno: { type: DataTypes.STRING(50), allowNull: false },
  status: { type: DataTypes.ENUM('ATIVO', 'INATIVO'), allowNull: false, defaultValue: 'ATIVO' },
}, {
  tableName: 'aluno',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: false,
});

module.exports = Aluno;