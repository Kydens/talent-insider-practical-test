const sequelize = require('../../../../config/sequelize');

const Users = require('./users');
const UserLogs = require('./usersLogs');
const UserCookies = require('./usersCookies');
const Resumes = require('./resumes');

Users.hasMany(UserLogs, { foreignKey: 'user_id' });
UserLogs.belongsTo(Users, { foreignKey: 'user_id' });

Users.hasMany(UserCookies, { foreignKey: 'user_id' });
UserCookies.belongsTo(Users, { foreignKey: 'user_id' });

Users.hasMany(Resumes, { foreignKey: 'user_id' });
Resumes.belongsTo(Users, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Users,
  UserLogs,
  UserCookies,
  Resumes,
};
