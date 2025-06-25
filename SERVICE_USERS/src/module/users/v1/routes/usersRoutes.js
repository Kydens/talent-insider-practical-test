// usersRoutes.js
const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllResumeByIdUser,
} = require('../controllers/usersControllers');
const { usersValidation } = require('../validations/usersValidations');
const upload = require('../../../../utils/uploadFilesUtils');
const router = express.Router();

router.post('/', usersValidation, createUser);
router.get('/', getAllUsers);
router.get('/:id/resume', getAllResumeByIdUser);
router.get('/:id', getUserById);
router.put(
  '/:id',
  upload().fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resumes', maxCount: 2 }, // Tidak ada batasan, di set menjadi 2 inggris dan bahasa
  ]),
  usersValidation,
  updateUser
);
router.delete('/:id', deleteUser);

module.exports = router;
