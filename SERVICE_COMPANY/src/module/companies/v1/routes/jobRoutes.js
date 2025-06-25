// jobRoutes.js
const express = require('express');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobControllers');
const { jobValidation } = require('../validations/jobValidations');
const router = express.Router();

router.post('/', jobValidation, createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.put('/:id', jobValidation, updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
