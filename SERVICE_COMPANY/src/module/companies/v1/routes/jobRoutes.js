// jobRoutes.js
const express = require('express');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
  updateApplyJob,
} = require('../controllers/jobControllers');
const { jobValidation } = require('../validations/jobValidations');
const router = express.Router();

router.post('/', jobValidation, createJob);
router.post('/apply', jobValidation, applyJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.put('/apply/:id', jobValidation, updateApplyJob);
router.put('/:id', jobValidation, updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
