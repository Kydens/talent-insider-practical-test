// jobValidation.js
const validator = require('validator');
const { sendResponse } = require('../../../../utils/responseUtils');
const jobValidation = (req, res, next) => {
  const {} = req.body;
  const errors = {};
  // Memastikan semua field yang diperlukan diisi

  // Jika ada error, kirim response
  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 400, 'error', 'Validation failed', errors);
  }
  next(); // Jika tidak ada error, lanjutkan ke middleware berikutnya
};

module.exports = { jobValidation };
