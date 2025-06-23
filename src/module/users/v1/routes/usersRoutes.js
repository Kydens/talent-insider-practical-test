// usersRoutes.js
const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/usersControllers');
const { usersValidation } = require('../validations/usersValidations');
// const upload = require('../../../../utils/uploadsUtils'); // Pastikan path benar!
const router = express.Router();

router.post(
  '/',
  // upload.fields([{ name: 'logoFile', maxCount: 1 }, { name: 'faviconFile', maxCount: 1 }]),
  usersValidation,
  createUser
);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put(
  '/:id',
  // upload.fields([{ name: 'logoFile', maxCount: 1 }, { name: 'faviconFile', maxCount: 1 }]),
  usersValidation,
  updateUser
);
router.delete('/:id', deleteUser);

module.exports = router;
