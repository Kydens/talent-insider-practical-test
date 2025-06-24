// usersRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const {
  createUser,
  resendActivation,
} = require('../controllers/usersControllers');
const upload = require('../../../../utils/uploadFilesUtils');

router.post('/resendOtp', resendActivation);
router.post(
  '/signup',
  upload().fields([
    { name: 'resumes', maxCount: 2 }, // Tidak ada batasan, di set menjadi 2 inggris dan bahasa
  ]),
  createUser
);
router.post('/login', authController.login);

module.exports = router;
