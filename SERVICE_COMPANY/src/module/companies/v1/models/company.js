// company.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const Company = sequelize.define(
  'company',
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
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organization_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry_id: {
      type: DataTypes.INTEGER, // asumsi ini dari table industri
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_access: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    tableName: 'company',
    timestamps: false,
  }
);

module.exports = Company;
