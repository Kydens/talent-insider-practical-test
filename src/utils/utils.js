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

const getUserIdFromToken = (req) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) throw new Error('Authorization header is missing!');

  // ambil token setelah bearer
  const token = authHeader.split(' ')[1];

  if (!token) throw new Error('Token is missing!');

  try {
    const decodedUser = jwt.verify(token, constants.JWT_SECRET);

    return decodedUser.id;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  isNotEmpty,
  isEmptyString,
  convertArrayToSingleJson,
  getUserIdFromToken,
};
