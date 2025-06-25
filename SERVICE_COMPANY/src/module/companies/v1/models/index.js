const sequelize = require('../../../../config/sequelize');

const Users = require('./users');
const Company = require('./company');
const Job = require('./job');
const UserJob = require('./userJob');
const Resumes = require('./resumes');

Users.hasMany(Company, { foreignKey: 'user_access' });
Company.belongsTo(Users, { foreignKey: 'user_access' });

Company.hasMany(Job, { foreignKey: 'company_id' });
Job.belongsTo(Company, { foreignKey: 'company_id' });

Users.hasMany(UserJob, { foreignKey: 'user_id' });
UserJob.belongsTo(Users, { foreignKey: 'user_id' });

Job.hasMany(UserJob, { foreignKey: 'job_id' });
UserJob.belongsTo(Job, { foreignKey: 'job_id' });

Resumes.hasMany(UserJob, { foreignKey: 'resume_id' });
UserJob.belongsTo(Resumes, { foreignKey: 'resume_id' });

module.exports = {
  sequelize,
  Users,
  Company,
  Job,
  UserJob,
};
