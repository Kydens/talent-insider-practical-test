// usersService.js
const bcyrpt = require('bcrypt');
const User = require('../models/users');
const pool = require('../../../../config/database');
const constants = require('../../../../config/constants');
const {
  convertArrayToSingleJson,
  getFormattedDate,
} = require('../../../../utils/utils');
const {
  insertTransaction,
  updateTransaction,
} = require('../../../../utils/crudUtils');

const createUserService = async (req) => {
  const now = new Date();
  const row = req.body;

  try {
    const userExisted = await User.findOne({ where: { email: row.email } });
    if (userExisted) {
      throw new Error('Email sudah terpakai!');
    }

    let hashPassword = null;
    if (row.password) {
      if (row.password.length < 8) {
        throw new Error('Password minimal 8 karakter!');
      }

      hashPassword = await bcyrpt.hash(
        row.password,
        parseInt(constants.SALT_ROUNDS)
      );
    }

    const data = {
      first_name: row.firstName,
      last_name: row.lastName,
      email: row.email,
      password: hashPassword,
      isActive: row.isActive,
      role: row.role,
      about: row.about,
      // photo: row.photo,
      created_at: now,
    };

    const user = await User.create(data);
    return user;
  } catch (error) {
    console.log('error in create user service: ', error.message);
    throw error;
  }
};

const getAllUsersService = async () => {
  const user = await User.findAll();
  return user;
};

const getUsersService = async (
  size,
  offset,
  search,
  sortBy = 'created_at',
  sortOrder = 'DESC',
  startDate = null,
  endDate = null
) => {
  let query = `
        SELECT * FROM users
    `;
  const values = [];

  if (search) {
    query += ` AND (first_name ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1})`;
    values.push(`%${search}%`);
  }

  if (startDate && endDate) {
    query += ` AND created_at BETWEEN $${values.length + 1} AND $${values.length + 2}`;
    values.push(startDate, endDate);
  }

  query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(size, offset);

  const { rows } = await pool.query(query, values);
  return rows;
};

const getUsersCountService = async (
  search,
  startDate = null,
  endDate = null
) => {
  let query = `
        SELECT COUNT(*) FROM users
    `;
  const values = [];

  if (search) {
    query += ` AND (name ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1})`;
    values.push(`%${search}%`);
  }

  if (startDate && endDate) {
    query += ` AND created_at BETWEEN $${values.length + 1} AND $${values.length + 2}`;
    values.push(startDate, endDate);
  }

  const { rows } = await pool.query(query, values);
  return parseInt(rows[0].count, 10);
};

const getTotalUsersService = async () => {
  const query = `
        SELECT COUNT(*) FROM users
    `;
  const { rows } = await pool.query(query);
  return parseInt(rows[0].count, 10);
};

const getUserByIdService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUserService = async (id, req) => {
  const now = new Date();
  const row = req.body;

  try {
    const user = await getUserByIdService(id);
    if (!user) {
      throw new Error('User tidak ada!');
    }

    let hashNewPassword = null;
    if (row.password) {
      if (row.password.length < 8) {
        throw new Error('Password minimal 8 karakter!');
      }

      hashNewPassword = await bcyrpt.hash(
        row.password,
        parseInt(constants.SALT_ROUNDS)
      );
    }

    const data = {
      first_name: row.firstName,
      last_name: row.lastName,
      email: row.email,
      password: hashNewPassword,
      isActive: row.isActive,
      role: row.role,
      about: row.about,
      // photo: row.photo,
      created_at: now,
    };

    await User.update(data, { where: { id: user.id } });
    return await getUserByIdService(user.id);
  } catch (error) {
    console.log('error in create user service: ', error.message);
    throw error;
  }

  await user.update(data);
  return user;
};

const deleteUserService = async (id) => {
  const user = await getUserByIdService(id);
  return await User.destroy({ where: { id: user.id } });
};

const getJsonRowUserService = async (data) => {
  const checkList = Array.isArray(data) ? 'array' : 'tunggal';
  const dataArray = Array.isArray(data) ? data : [data];
  const json = dataArray.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    password: row.password,
    isActive: row.isActive,
    role: row.role,
    about: row.about,
    // photo: row.photo,
    createdAt: row.created_at,
  }));

  if (checkList == 'array') {
    return json;
  } else {
    return await convertArrayToSingleJson(json);
  }
};

module.exports = {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getUsersService,
  getUsersCountService,
  getTotalUsersService,
  getJsonRowUserService,
};
