const nodemailer = require('nodemailer');
const constants = require('./constants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: constants.emailGmail,
    pass: constants.passwordGmail,
  },
});

module.exports = transporter;
