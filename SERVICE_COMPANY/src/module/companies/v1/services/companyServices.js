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
  checkCompanyAccess,
} = require('../../../../utils/utils');
const {
  insertTransaction,
  updateTransaction,
} = require('../../../../utils/crudUtils');

const createCompanyService = async (req) => {
  const userId = getUserIdFromToken(req);
  const now = new Date();
  const row = req.body;

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

const getAllCompaniesService = async (req) => {
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
  const userId = getUserIdFromToken(req);
  const now = new Date();
  const row = req.body;

  try {
    const company = await Company.findOne({
      where: { user_access: userId }, // salah disini
    });

    if (!company) {
      throw new Error('Anda tidak memiliki company.');
    }

    const dataCompany = {
      name: row.name,
      city: row.city,
      organization_size: row.organizationSize,
      industry_id: row.industryId,
      about: row.about ?? null,
      updated_at: now,
    };

    if (req.files && req.files.logo) {
      dataCompany.logo = `/uploads/company/${getFormattedDate('/')}/${
        req.files.logo[0].filename
      }`;
    }

    await Company.update(dataCompany, { where: { id: id } });
    const rowCompany = await getCompanyByIdService(id);

    return rowCompany;
  } catch (error) {
    console.log('error in update user service: ', error.message);
    throw error;
  }
};

const deleteCompanyService = async (id) => {
  const company = await getUserByIdService(id);
  return await Company.destroy({ where: { id: company.id } });
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
