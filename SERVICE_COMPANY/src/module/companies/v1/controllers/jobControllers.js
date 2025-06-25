// companyController.js
const {
  createJobService,
  getJobByIdService,
  getJsonRowJobService,
  updateJobService,
  deleteJobService,
  getAllJobsService,
  applyJobService,
  updateApplyJobService,
} = require('../services/jobServices');
const { sendResponse } = require('../../../../utils/responseUtils');

const createJob = async (req, res) => {
  try {
    const job = await createJobService(req);
    const result = await getJsonRowJobService(job);
    return sendResponse(
      res,
      201,
      'success',
      'Job created successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const getAllJobs = async (req, res) => {
  try {
    const job = await getAllJobsService(req);
    const result = await getJsonRowJobService(job);

    return sendResponse(res, 200, 'success', 'Job data successfully', result);
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

const getJobById = async (req, res) => {
  try {
    const job = await getJobByIdService(req.params.id);
    const result = await getJsonRowJobService(job);
    return sendResponse(
      res,
      200,
      'success',
      'Job retrieved successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 404, 'error', error.message);
  }
};

const updateJob = async (req, res) => {
  try {
    const result = await updateJobService(req.params.id, req);

    return sendResponse(
      res,
      200,
      'success',
      'Job updated successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await deleteJobService(req.params.id);
    return sendResponse(res, 200, 'success', 'Job deleted successfully', {
      job_id: job,
    });
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const applyJob = async (req, res) => {
  try {
    const applyJob = await applyJobService(req);
    return sendResponse(
      res,
      200,
      'success',
      'Apply Job successfully',
      applyJob
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const updateApplyJob = async (req, res) => {
  try {
    const applyJob = await updateApplyJobService(req.params.id, req);
    return sendResponse(
      res,
      200,
      'success',
      'Apply Job updated successfully',
      applyJob
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
  updateApplyJob,
};
