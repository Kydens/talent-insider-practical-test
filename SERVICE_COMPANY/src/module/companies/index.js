const express = require('express');
const router = express.Router();

const companyRoutes = require('./v1/routes/companyRoutes');

router.use('/company', companyRoutes);

module.exports = router;
