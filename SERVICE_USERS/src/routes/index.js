const express = require('express');
const router = express.Router();

const userModule = require('../module/users');

router.use('/v1', userModule);

module.exports = router;
