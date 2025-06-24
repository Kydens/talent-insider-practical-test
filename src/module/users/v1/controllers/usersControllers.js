// usersController.js
const {
  createUserService,
  getUsersService,
  getTotalUsersService,
  getUserByIdService,
  getJsonRowUserService,
  updateUserService,
  deleteUserService,
  getDataResumeByIdUserService,
  sendActivationService,
  getUserByEmailService,
} = require('../services/usersServices');
const { sendResponse } = require('../../../../utils/responseUtils');
const { checkRoleAdminPermission } = require('../../../../utils/utils');

const resendActivation = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await sendActivationService(email);
    return sendResponse(
      res,
      200,
      'success',
      'Resend OTP retrieved successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 404, 'error', error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await createUserService(req);
    const result = await getJsonRowUserService(user);
    return sendResponse(
      res,
      201,
      'success',
      'User created successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const getAllResumeByIdUser = async (req, res) => {
  try {
    const result = await getDataResumeByIdUserService(req.params.id);
    return sendResponse(
      res,
      200,
      'success',
      'Resumes retrieved successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 404, 'error', error.message);
  }
};

const getAllUsers = async (req, res) => {
  if (!checkRoleAdminPermission(req)) {
    return sendResponse(res, 403, 'error', 'Anda tidak memiliki akses ini!');
  }

  try {
    // Ambil parameter dari query string
    const {
      size = 10,
      page = 0,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      startDate,
      endDate,
    } = req.query;
    const offset = page * size;

    // Ambil data {NAMEROW} dengan filter dan sorting
    const user = await getUsersService(
      size,
      offset,
      search,
      sortBy,
      sortOrder,
      startDate,
      endDate
    );
    const totalCount = await getTotalUsersService();
    const totalPages = Math.ceil(totalCount / size);

    const result = await getJsonRowUserService(user);

    return sendResponse(res, 200, 'success', 'User data successfully', {
      data: result,
      paging: {
        currentPage: parseInt(page),
        totalPage: parseInt(totalPages),
        total: parseInt(totalCount),
        size: parseInt(size, 10),
      },
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      'Error retrieving User',
      error.message
    );
  }
};

const getUserById = async (req, res) => {
  if (!checkRoleAdminPermission(req)) {
    return sendResponse(res, 403, 'error', 'Anda tidak memiliki akses ini!');
  }

  try {
    const user = await getUserByIdService(req.params.id);
    const result = await getJsonRowUserService(user);
    return sendResponse(
      res,
      200,
      'success',
      'User retrieved successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 404, 'error', error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await updateUserService(req.params.id, req);

    return sendResponse(
      res,
      200,
      'success',
      'user updated successfully',
      result
    );
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserService(req.params.id);
    return sendResponse(res, 200, 'success', 'user deleted successfully', {
      user_id: user,
    });
  } catch (error) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

module.exports = {
  resendActivation,
  createUser,
  getAllUsers,
  getAllResumeByIdUser,
  getUserById,
  updateUser,
  deleteUser,
};
