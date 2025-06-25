const sendResponse = (res, code, status, message, data = []) => {
  const response = {};
  if (status == 'success') {
    response.success = true;
  } else {
    response.success = false;
  }

  response.status = status;
  response.code = code;
  response.message = message;

  if (code === 400 || code === 500) {
    response.errors = data;
  } else {
    response.data = data.data || data;
  }

  // prepare paging untuk datatable
  if (data.paging) {
    response.paging = data.paging || {};
  }

  return res.status(code).json(response);
};

module.exports = { sendResponse };
