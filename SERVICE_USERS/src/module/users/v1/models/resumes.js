// resumes.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');
const { now } = require('sequelize/lib/utils');

const Resumes = sequelize.define(
  'resumes',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: now,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'resumes',
    timestamps: false,
  }
);

module.exports = Resumes;
