// usersService.js
const bcyrpt = require('bcrypt');
const { Job, Company, UserJob } = require('../models');
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

const applyJobService = async (req) => {
  const userId = getUserIdFromToken(req);
  const client = await pool.connect();
  const row = req.body;
  const now = new Date();

  try {
    await client.query('BEGIN');

    const existingAppliedJobs = await UserJob.findOne({
      where: { user_id: userId, job_id: row.jobId },
    });

    if (existingAppliedJobs) {
      throw new Error('Anda sudah apply job tersebut.');
    }

    const queryDataUser = `
      SELECT 
        u.id AS userid,
        r.id AS resumeid
      FROM users u
      JOIN resumes r ON u.id = r.user_id
      WHERE u.id = $1 AND r.id = $2 AND u."isActive" = true
      LIMIT 1
    `;

    const { rows } = await client.query(queryDataUser, [userId, row.resumeId]);

    if (rows.length === 0) {
      throw new Error('Anda belum upload resume.');
    }

    const checkJobExisted = await Job.findOne({ where: { id: row.jobId } });

    if (!checkJobExisted) {
      throw new Error('Job tersebut sedang tidak tersedia.');
    }

    const dataApply = {
      user_id: userId,
      resume_id: row.resumeId,
      job_id: row.jobId,
      created_at: now,
    };

    const applyJobs = await UserJob.create(dataApply);
    await client.query('COMMIT');
    return applyJobs;
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('error in apply job service: ', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const updateApplyJobService = async (id, req) => {
  const userId = getUserIdFromToken(req);
  const client = await pool.connect();
  const row = req.body;
  const now = new Date();

  try {
    await client.query('BEGIN');
    const queryDataUser = `
      SELECT 
        u.id AS userid,
        r.id AS resumeid
      FROM users u
      JOIN resumes r ON u.id = r.user_id
      WHERE u.id = $1 AND r.id = $2 AND u."isActive" = true
      LIMIT 1
    `;

    const { rows } = await client.query(queryDataUser, [userId, row.resumeId]);

    if (rows.length === 0) {
      throw new Error('Resume anda tidak tersedia.');
    }

    const checkJobExisted = await Job.findOne({ where: { id: row.jobId } });

    if (!checkJobExisted) {
      throw new Error('Job tersebut sedang tidak tersedia.');
    }

    const dataApply = {
      user_id: userId,
      resume_id: row.resumeId,
      job_id: row.jobId,
      updated_at: now,
    };

    const checkApplyJob = await UserJob.findOne({ where: { id: id } });

    if (!checkApplyJob) {
      throw new Error('Anda belum apply ke job ini!');
    }

    const applyJobs = await UserJob.update(dataApply, {
      where: { id: id },
      returning: id,
    });

    await client.query('COMMIT');
    return applyJobs;
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('error in apply job service: ', error.message);
    throw error;
  } finally {
    client.release();
  }
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
  applyJobService,
  updateApplyJobService,
};
