const express = require('express');
const router = express.Router();

const companyModule = require('../module/companies');

router.use('/v1', companyModule);

module.exports = router;
