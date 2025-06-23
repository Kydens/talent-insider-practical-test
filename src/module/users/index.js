const express = require('express');
const router = express.Router();

const userRoutes = require('./v1/routes/usersRoutes');
const authRoutes = require('./v1/routes/authRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
