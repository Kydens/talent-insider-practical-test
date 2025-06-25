// users.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const Users = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Users;
