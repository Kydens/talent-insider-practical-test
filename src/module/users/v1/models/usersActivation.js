// userActivation.js
const { DataTypes, ENUM } = require('sequelize');
const sequelize = require('../../../../config/sequelize');
const { now } = require('sequelize/lib/utils');

const userActivation = sequelize.define(
  'userActivation',
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
      onUpdate: 'CASCADE',
    },
    otpCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Used', 'Expired'),
      allowNull: false,
      defaultValue: 'Active',
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_send_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'userActivation',
    timestamps: false,
  }
);

module.exports = userActivation;
