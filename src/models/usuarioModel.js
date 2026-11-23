const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tipo: {
    type: DataTypes.ENUM('ADMIN', 'USER'),
    defaultValue: 'USER'
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ATIVO', 'INATIVO'),
    defaultValue: 'ATIVO'
  }
}, {
  tableName: 'usuario',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

module.exports = Usuario;