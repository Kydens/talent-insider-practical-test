// companyRoutes.js
const express = require('express');
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyControllers');
const { companyValidation } = require('../validations/companyValidations');
const upload = require('../../../../utils/uploadFilesUtils');
const router = express.Router();

router.post('/', companyValidation, createCompany);
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.put(
  '/:id',
  upload().fields([{ name: 'logo', maxCount: 1 }]),
  companyValidation,
  updateCompany
);
router.delete('/:id', deleteCompany);

module.exports = router;
