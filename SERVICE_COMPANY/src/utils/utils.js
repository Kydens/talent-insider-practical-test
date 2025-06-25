const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

const isNotEmpty = (variable) => {
  return variable !== null && variable !== undefined && variable !== '';
};

const isNullOrUndefined = (variable) => {
  return variable === null || variable === undefined;
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

const getFormattedDate = (separator = '-') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
};

const isEmptyFile = (file) => {
  if (isNullOrUndefined(file) || isEmptyString(file)) {
    return null;
  }

  return constants.URL_API + file;
};

const checkRoleAdminPermission = (req) => {
  if (!req.user) {
    throw new Error('User data not found in request!');
  }

  if (isNotEmpty(req.user.role) && req.user.role == 'Admin') {
    return true;
  }

  return false;
};

const checkCompanyAccess = (req, decodedUserId) => {
  console.log(req);
  if (!req.user) {
    throw new Error('User data not found in request!');
  }

  if (isNotEmpty(req.user.id) && req.user.id == decodedUserId) {
    return true;
  }

  return false;
};

const getUserIdFromToken = (req) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) throw new Error('Authorization header is missing!');

    const token = authHeader.split(' ')[1];

    if (!token) throw new Error('Token is missing!');

    const decodedUser = jwt.verify(token, constants.JWT_SECRET);

    return decodedUser.id;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  isNotEmpty,
  isEmptyString,
  isEmptyFile,
  getFormattedDate,
  convertArrayToSingleJson,
  checkRoleAdminPermission,
  checkCompanyAccess,
  getUserIdFromToken,
};
