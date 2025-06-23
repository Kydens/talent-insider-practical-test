const { Sequelize } = require('sequelize');
const constants = require('./constants');

const sequelize = new Sequelize(
  constants.NAME_DB,
  constants.USER_DB,
  constants.PASSWORD_DB,
  {
    host: constants.HOST_DB,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
