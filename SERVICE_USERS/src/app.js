const express = require('express');
const bodyParser = require('body-parser');
const { default: helmet } = require('helmet');

const sequelize = require('./config/sequelize');
const constants = require('./config/constants');

const app = express();
const routes = require('./routes');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(routes);

// route default
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to 'User Service' API!",
    status: 'success',
    version: '1.0.0',
  });
});

require('./module/users/v1/models/usersLogs');
require('./module/users/v1/models/resumes');
require('./module/users/v1/models/usersCookies');
require('./module/users/v1/models/users');
require('./module/users/v1/models/usersActivation');

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database Synchronized!');
  } catch (error) {
    console.log('Error Sync Database: ', error);
  }
};

syncDatabase();

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDev = constants.MODE === 'development';

  console.error(`Error: ${err.message}`);
  if (isDev) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Something went wrong!',
    stack: isDev ? err.stack : undefined,
  });
});

const PORT = constants.PORT;
app.listen(PORT, () => {
  console.log(`Service User is running on http://localhost:${PORT}`);
});
