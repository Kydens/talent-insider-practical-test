require('dotenv').config();

const constants = {
  PORT: process.env.PORT,
  URL_API: process.env.URL_API,
  USER_DB: process.env.USER_DB,
  HOST_DB: process.env.HOST_DB,
  PORT_DB: process.env.PORT_DB,
  NAME_DB: process.env.NAME_DB,
  PASSWORD_DB: process.env.PASSWORD_DB,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TIME_DEFAULT: process.env.JWT_TIME_DEFAULT,
  JWT_REFRESH_TIME: process.env.JWT_REFRESH_TIME,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
};

module.exports = constants;
