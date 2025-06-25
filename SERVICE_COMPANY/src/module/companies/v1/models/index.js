const sequelize = require('../../../../config/sequelize');

const Users = require('./users');
const Company = require('./company');
const Job = require('./job');

Users.hasMany(Company, { foreignKey: 'user_access' });
Company.belongsTo(Users, { foreignKey: 'user_access' });

Company.hasMany(Job, { foreignKey: 'company_id' });
Job.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = {
  sequelize,
  Users,
  Company,
  Job,
};
