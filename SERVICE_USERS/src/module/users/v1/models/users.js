// users.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const users = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'User'),
      defaultValue: 'User',
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

module.exports = users;
