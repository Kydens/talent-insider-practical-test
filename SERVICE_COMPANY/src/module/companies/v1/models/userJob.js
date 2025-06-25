// userJob.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');
const { now } = require('sequelize/lib/utils');

const UserJob = sequelize.define(
  'userJob',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    resume_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'resumes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'job',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    tableName: 'userJob',
    timestamps: false,
  }
);

module.exports = UserJob;
