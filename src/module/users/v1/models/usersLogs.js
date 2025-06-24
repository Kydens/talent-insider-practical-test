const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const UserLogs = sequelize.define(
  'userLogs',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_logs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'usersLogs',
    timestamps: false,
  }
);

UserLogs.createUserLogs = async function (
  userId,
  email,
  statusLogs,
  description
) {
  return await UserLogs.create({
    user_id: userId,
    email: email,
    status_logs: statusLogs,
    description: description,
  });
};

module.exports = UserLogs;
