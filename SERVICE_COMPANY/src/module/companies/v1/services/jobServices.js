// usersService.js
const bcyrpt = require('bcrypt');
const { Job, Company } = require('../models');
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

const createJobService = async (req) => {
  const userId = getUserIdFromToken(req);
  const now = new Date();
  const row = req.body;

  try {
    const company = await Company.findOne({
      where: { user_access: userId },
    });

    if (!company) {
      throw new Error('Anda tidak memiliki company.');
    }

    const dataJob = {
      job_title: row.jobTitle,
      company_id: company.id,
      location: row.location,
      workspace_type: row.workspaceType,
      min_salary: row.minSalary,
      max_salary: row.maxSalary,
      created_at: now,
    };

    const job = await Job.create(dataJob);
    const rowJob = await getJobByIdService(job.id);

    return rowJob;
  } catch (error) {
    console.log('error in create user service: ', error.message);
    throw error;
  }
};

const getAllJobsService = async (req) => {
  const userId = getUserIdFromToken(req);
  const company = await Company.findOne({ where: { user_access: userId } });

  const job = await Job.findAll({ where: { company_id: company.id } });
  return job;
};

const getJobByIdService = async (id) => {
  const job = await Job.findByPk(id);
  if (!job) {
    throw new Error('job not found');
  }
  return job;
};

const updateJobService = async (id, req) => {
  const userId = getUserIdFromToken(req);
  const now = new Date();
  const row = req.body;

  try {
    const company = await Company.findOne({
      where: { user_access: userId },
    });

    if (!company) {
      throw new Error('Anda tidak memiliki company.');
    }

    const job = await Job.findOne({
      where: { company_id: company.id },
    });

    if (!job) {
      throw new Error('Anda tidak memiliki Job.');
    }

    const dataJob = {
      job_title: row.jobTitle,
      company_id: company.id,
      location: row.location,
      workspace_type: row.workspaceType,
      min_salary: row.minSalary,
      max_salary: row.maxSalary,
      updated_at: now,
    };

    await Job.update(dataJob, { where: { id: id } });
    const rowJob = await getJobByIdService(id);

    return rowJob;
  } catch (error) {
    console.log('error in update job service: ', error.message);
    throw error;
  }
};

const deleteJobService = async (id) => {
  const job = await getJobByIdService(id);
  return await job.destroy({ where: { id: job.id } });
};

const getJsonRowJobService = async (data) => {
  const checkList = Array.isArray(data) ? 'array' : 'tunggal';
  const dataArray = Array.isArray(data) ? data : [data];
  const json = dataArray.map((row) => ({
    id: row.id,
    jobTitle: row.job_title,
    companyId: row.company_id,
    location: row.location,
    workspaceType: row.workspace_type,
    minSalary: row.min_salary,
    maxSalary: row.max_salary,
    createdAt: row.created_at,
  }));

  if (checkList == 'array') {
    return json;
  } else {
    return await convertArrayToSingleJson(json);
  }
};

module.exports = {
  createJobService,
  getAllJobsService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
  getJsonRowJobService,
};
