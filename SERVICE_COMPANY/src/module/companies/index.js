const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');
const companyRoutes = require('./v1/routes/companyRoutes');
const jobRoutes = require('./v1/routes/jobRoutes');

router.use('/company', authMiddleware, companyRoutes);
router.use('/jobs', authMiddleware, jobRoutes);

module.exports = router;
