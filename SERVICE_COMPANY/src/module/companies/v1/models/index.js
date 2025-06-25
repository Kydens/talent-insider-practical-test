const sequelize = require('../../../../config/sequelize');

const Users = require('./users');
const Company = require('./company');

Users.hasMany(Company, { foreignKey: 'user_access' });
Company.belongsTo(Users, { foreignKey: 'user_access' });

module.exports = {
  sequelize,
  Users,
  Company,
};
