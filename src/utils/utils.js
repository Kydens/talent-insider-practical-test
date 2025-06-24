const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

const isNotEmpty = (variable) => {
  return variable !== null && variable !== undefined && variable !== '';
};

const isEmptyString = (variable) => {
  return typeof variable === 'string' && variable.trim() === '';
};

const convertArrayToSingleJson = (dataArray) => {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error('Input harus berupa array yang tidak kosong');
  }

  return dataArray[0];
};

const checkRoleAdminPermission = (req) => {
  if (!req.user) {
    throw new Error('User data not found in request!');
  }

  if (req.user.role == 'Admin') {
    return true;
  }

  return false;
};

module.exports = {
  isNotEmpty,
  isEmptyString,
  convertArrayToSingleJson,
  checkRoleAdminPermission,
};
