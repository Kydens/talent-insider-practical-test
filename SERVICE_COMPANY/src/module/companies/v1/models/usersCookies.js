const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const UserCookies = sequelize.define(
  'userCookies',
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
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'usersCookies',
    timestamps: false,
  }
);

UserCookies.createUserCookie = async function (
  userId,
  token,
  refresh_token,
  expiredAt
) {
  return await UserCookies.create({
    user_id: userId,
    access_token: token,
    refresh_token: refresh_token,
    expired_at: expiredAt,
  });
};

module.exports = UserCookies;
