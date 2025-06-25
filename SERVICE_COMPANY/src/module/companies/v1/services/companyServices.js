// usersService.js
const bcyrpt = require('bcrypt');
const { Company } = require('../models');
const pool = require('../../../../config/database');
const constants = require('../../../../config/constants');
const {
  convertArrayToSingleJson,
  getFormattedDate,
  isEmptyFile,
  getUserIdFromToken,
} = require('../../../../utils/utils');
const {
  insertTransaction,
  updateTransaction,
} = require('../../../../utils/crudUtils');

const createCompanyService = async (req) => {
  const userId = getUserIdFromToken(req);
  const now = new Date();
  // const row = req.body;
  console.log(req);

  try {
    const dataCompany = {
      name: row.name,
      city: row.city,
      organization_size: row.organizationSize,
      industry_id: row.industryId,
      user_access: userId,
      about: row.about ?? null,
      created_at: now,
    };

    if (req.files && req.files.logo) {
      dataCompany.logo = `/uploads/company/${getFormattedDate('/')}/${
        req.files.logo[0].filename
      }`;
    }

    const company = await Company.create(dataCompany);
    const rowCompany = await getCompanyByIdService(company.id);

    return rowCompany;
  } catch (error) {
    console.log('error in create user service: ', error.message);
    throw error;
  }
};

const getAllCompaniesService = async () => {
  const userId = getUserIdFromToken(req);
  const company = await Company.findAll({ where: { user_access: userId } });
  return company;
};

const getCompanyByIdService = async (id) => {
  const company = await Company.findByPk(id);
  if (!company) {
    throw new Error('Company not found');
  }
  return company;
};

const updateCompanyService = async (id, req) => {
  const now = new Date();
  const row = req.body;
  console.log(row);

  try {
    const company = await getUserByIdService(id);
    if (!user) {
      throw new Error('User tidak ada!');
    }

    const datacompany = {
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

    await Company.update(dataUser, { where: { id: user.id } });
    const rowcompany = await getUserByIdService(user.id);

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

const deleteCompanyService = async (id) => {
  const company = await getUserByIdService(id);
  return await Company.destroy({ where: { id: user.id } });
};

const getJsonRowCompanyService = async (data) => {
  const checkList = Array.isArray(data) ? 'array' : 'tunggal';
  const dataArray = Array.isArray(data) ? data : [data];
  const json = dataArray.map((row) => ({
    id: row.id,
    name: row.name,
    city: row.city,
    organizationSize: row.organization_size,
    industryId: row.industry_id,
    userAccess: row.user_access,
    logo: isEmptyFile(row.logo),
    createdAt: row.created_at,
  }));

  if (checkList == 'array') {
    return json;
  } else {
    return await convertArrayToSingleJson(json);
  }
};

module.exports = {
  createCompanyService,
  getAllCompaniesService,
  getCompanyByIdService,
  updateCompanyService,
  deleteCompanyService,
  getJsonRowCompanyService,
};
