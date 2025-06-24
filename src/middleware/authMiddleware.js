const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const { sendResponse } = require('../utils/responseUtils');
const constants = require('../config/constants');
const Users = require('../module/users/v1/models/users');
const UserCookies = require('../module/users/v1/models/usersCookies');
let redisAvailable = true;

redis.on('error', () => (redisAvailable = false));
redis.on('connect', () => (redisAvailable = true));

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return sendResponse(res, 400, 'error', 'Token tidak ditemukan');
    }

    let decodedUser;

    try {
      decodedUser = await jwt.verify(token, constants.JWT_SECRET);
    } catch (error) {
      return sendResponse(
        res,
        400,
        'error',
        'Token tidak valid atau kadaluwarsa'
      );
    }

    const userId = decodedUser.id;
    const redisKey = `user_auth:${userId}`;

    let userData;

    if (redisAvailable) {
      const cachedData = await redis.get(redisKey);

      if (cachedData) {
        userData = JSON.parse(cachedData);
      }
    }

    if (!userData) {
      const user = await Users.findOne({ where: { id: userId } });

      if (!user || !user.isActive) {
        if (redisAvailable) {
          await redis.del(redisKey);
        }

        return sendResponse(res, 403, 'error', 'Akun anda dinonaktifkan');
      }

      const userCookie = await UserCookies.findOne({
        where: { access_token: token },
      });

      if (!userCookie)
        return sendResponse(res, 403, 'error', 'Session tidak valid!');

      if (!userCookie.isActive) {
        if (redisAvailable) {
          await redis.del(redisKey);
        }

        return sendResponse(res, 403, 'error', 'Akses token dibanned');
      }

      let refreshDecoded;
      try {
        refreshDecoded = await jwt.verify(
          userCookie.refresh_token,
          constants.JWT_SECRET
        );
      } catch (refreshError) {
        console.error('Refresh token kadaluwarsa: ', refreshError.message);

        await UserCookies.update(
          { isActive: false },
          { where: { refresh_token: userCookie.refresh_token } }
        );

        if (redisAvailable) {
          await redis.del(redisKey);
        }

        return sendResponse(
          res,
          403,
          'error',
          'Refresh token kadaluwarsa. Silahkan login kembali.'
        );
      }

      userData = { isActive: true };
    }

    if (!userData.isActive) {
      return sendResponse(res, 403, 'error', 'Akun anda telah dinonaktifkan');
    }

    if (redisAvailable) {
      await redis.setex(redisKey, 3600, JSON.stringify(userData));
    }

    req.user = {
      id: decodedUser.id,
      role: decodedUser.role,
    };

    return next();
  } catch (error) {
    console.error('Error in authMiddleware: ', error.message);
    if (!res.headersSent) {
      return sendResponse(res, 500, 'error', 'Terjadi kesalahan pada server');
    }
  }
};

module.exports = authMiddleware;
