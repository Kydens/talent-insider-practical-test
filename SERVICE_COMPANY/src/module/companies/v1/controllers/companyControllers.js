// companyController.js
const {
  createCompanyService,
  getCompaniesService,
  getTotalCompaniesService,
  getCompanyByIdService,
  getJsonRowCompanyService,
  updateCompanyService,
  deleteCompanyService,
  getAllCompaniesService,
} = require('../services/companyServices');
const { sendResponse } = require('../../../../utils/responseUtils');
const { checkRoleAdminPermission } = require('../../../../utils/utils');

const createCompany = async (req, res) => {
  try {
    const company = await createCompanyService(req);
    const result = await getJsonRowCompanyService(company);
    return sendResponse(
      res,
      201,
      'success',
      'Company created successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const company = await getAllCompaniesService(req);
    const result = await getJsonRowCompanyService(company);

    return sendResponse(
      res,
      200,
      'success',
      'Company data successfully',
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      'Error retrieving User',
      error.message
    );
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await getCompanyByIdService(req.params.id);
    const result = await getJsonRowCompanyService(company);
    return sendResponse(
      res,
      200,
      'success',
      'Company retrieved successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 404, 'error', error.message);
  }
};

const updateCompany = async (req, res) => {
  try {
    const result = await updateCompanyService(req.params.id, req);

    return sendResponse(
      res,
      200,
      'success',
      'Company updated successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await deleteCompanyService(req.params.id);
    return sendResponse(res, 200, 'success', 'Company deleted successfully', {
      company_id: company,
    });
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
