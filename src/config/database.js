const { Pool } = require('pg');
const constants = require('./constants');

const pool = new Pool({
  user: constants.USER_DB,
  host: constants.HOST_DB,
  database: constants.NAME_DB,
  password: constants.PASSWORD_DB,
  port: constants.PORT_DB,
});

module.exports = pool;
