// resumes.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const Resumes = sequelize.define(
  'resumes',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: 'resumes',
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Resumes;
