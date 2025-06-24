// usersService.js
const bcyrpt = require('bcrypt');
const { Users, Resumes } = require('../models');
const pool = require('../../../../config/database');
const constants = require('../../../../config/constants');
const {
  convertArrayToSingleJson,
  getFormattedDate,
  isEmptyFile,
} = require('../../../../utils/utils');
const {
  insertTransaction,
  updateTransaction,
} = require('../../../../utils/crudUtils');

const createUserService = async (req) => {
  const now = new Date();
  const row = req.body;

  try {
    const userExisted = await Users.findOne({ where: { email: row.email } });
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

    const dataUser = {
      first_name: row.firstName,
      last_name: row.lastName,
      email: row.email,
      password: hashPassword,
      isActive: row.isActive,
      role: row.role,
      about: row.about ?? null,
      created_at: now,
    };

    if (req.files && req.files.photo) {
      dataUser.photo = `/uploads/avatars/${getFormattedDate('/')}/${
        req.files.photo[0].filename
      }`;
    }

    const user = await Users.create(dataUser);
    const rowUser = await getUserByIdService(user.id);

    const resumeInserted = req.files.resumes;
    if (req.files && resumeInserted) {
      const dataResume = resumeInserted.map((file) => ({
        name: file.filename,
        attachment: req.files.attachment?.[0]?.filename ?? null,
        user_id: rowUser.id,
        created_at: now,
      }));

      const inserted = await Resumes.bulkCreate(dataResume);

      if (!inserted || inserted.length === 0) {
        throw new Error('Gagal menambahkan resume');
      }
    }

    return rowUser;
  } catch (error) {
    console.log('error in create user service: ', error.message);
    throw error;
  }
};

const getDataResumeByIdUserService = async (id) => {
  const query = `
    SELECT
      u.id, 
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.email AS email,
      json_agg(
        json_build_object(
          'id', r.id,
          'name',
            CASE 
              WHEN r.name IS NOT NULL AND r.name != '' 
                THEN CONCAT('${constants.URL_API}', r.name)
              ELSE NULL
            END,
          'attachment',
            CASE 
              WHEN r.attachment IS NOT NULL AND r.attachment != '' 
                THEN CONCAT('${constants.URL_API}', r.attachment)
              ELSE NULL
            END,
          'createdAt', r.created_at,
          'updatedAt', r.updated_at
        )
        ORDER BY r.created_at DESC
      ) AS resumes
    FROM users u
    LEFT JOIN resumes r ON r.user_id = u.id
    WHERE u."isActive" = true AND u.id = $1
    GROUP BY u.id, u.first_name, u.last_name, u.email
  `;

  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllUsersService = async () => {
  const user = await Users.findAll();
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
        SELECT id, first_name, last_name, email, "isActive", role, about, photo, created_at FROM users
    `;
  const values = [];

  if (search) {
    query += ` AND (first_name ILIKE $${values.length + 1} OR email ILIKE $${
      values.length + 1
    })`;
    values.push(`%${search}%`);
  }

  if (startDate && endDate) {
    query += ` AND created_at BETWEEN $${values.length + 1} AND $${
      values.length + 2
    }`;
    values.push(startDate, endDate);
  }

  query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${
    values.length + 1
  } OFFSET $${values.length + 2}`;
  values.push(size, offset);

  const { rows } = await pool.query(query, values);
  return rows;
};

const getTotalUsersService = async () => {
  const query = `
        SELECT COUNT(id) FROM users
    `;
  const { rows } = await pool.query(query);
  return parseInt(rows[0].count, 10);
};

const getUserByIdService = async (id) => {
  const user = await Users.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUserService = async (id, req) => {
  const now = new Date();
  const row = req.body;
  console.log(row);

  try {
    const user = await getUserByIdService(id);
    if (!user) {
      throw new Error('User tidak ada!');
    }

    const dataUser = {
      first_name: row.firstName,
      last_name: row.lastName,
      email: row.email,
      about: row.about,
      updated_at: now,
    };

    if (row.password) {
      let hashNewPassword = null;
      if (row.password.length < 8) {
        throw new Error('Password minimal 8 karakter!');
      }

      hashNewPassword = await bcyrpt.hash(
        row.password,
        parseInt(constants.SALT_ROUNDS)
      );

      dataUser.password = hashNewPassword;
    }

    if (req.files && req.files.photo) {
      dataUser.photo = `/uploads/avatars/${getFormattedDate('/')}/${
        req.files.photo[0].filename
      }`;
    }

    await Users.update(dataUser, { where: { id: user.id } });
    const rowUser = await getUserByIdService(user.id);

    const resumeInserted = req.files.resumes;
    if (req.files && resumeInserted) {
      const dataResume = resumeInserted.map((file) => ({
        name: file.filename,
        attachment: req.files.attachment?.[0]?.filename ?? null,
        user_id: rowUser.id,
        created_at: now,
      }));

      const inserted = await Resumes.bulkCreate(dataResume);

      if (!inserted || inserted.length === 0) {
        throw new Error('Gagal menambahkan resume');
      }
    }

    return rowUser;
  } catch (error) {
    console.log('error in create user service: ', error.message);
    throw error;
  }
};

const deleteUserService = async (id) => {
  const user = await getUserByIdService(id);
  return await Users.destroy({ where: { id: user.id } });
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
    photo: isEmptyFile(row.photo),
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
  getDataResumeByIdUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getUsersService,
  getTotalUsersService,
  getJsonRowUserService,
};
