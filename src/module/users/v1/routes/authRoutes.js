// usersRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const { createUser } = require('../controllers/usersControllers');

router.post('/signup', createUser);
router.post('/login', authController.login);

module.exports = router;
