// job.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');
const { now } = require('sequelize/lib/utils');

const Job = sequelize.define(
  'job',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workspace_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    min_salary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_salary: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'job',
    timestamps: false,
  }
);

module.exports = Job;
