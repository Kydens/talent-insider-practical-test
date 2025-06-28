const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../../../../config/constants');
const User = require('../models/users');
const UserCookies = require('../models/usersCookies');
const UserLogs = require('../models/usersLogs');
const { sendResponse } = require('../../../../utils/responseUtils');

exports.login = async (req, res) => {
  console.log('[🧠 LOGIN] Masuk ke controller login');
  console.log('Body:', req.body);
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return sendResponse(
        res,
        400,
        'error',
        'Harap mengisi akun dan kata sandi anda.'
      );
    }

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return sendResponse(
        res,
        400,
        'error',
        'Email atau kata sandi tidak sesuai.'
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(
        res,
        400,
        'error',
        'Email atau kata sandi tidak sesuai'
      );
    }

    if (!user.isActive) {
      return sendResponse(res, 403, 'error', 'Akun anda tidak aktif');
    }

    let accessTokenExpiresIn = constants.JWT_TIME_DEFAULT;
    let refreshTokenExpiresIn = constants.JWT_REFRESH_TIME;

    const dataSign = {
      id: user.id,
      role: user.role,
    };

    const accessToken = jwt.sign(dataSign, constants.JWT_SECRET, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign(dataSign, constants.JWT_SECRET, {
      expiresIn: refreshTokenExpiresIn,
    });

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 hari

    res.cookie('users_cookies', refreshToken, {
      httpOnly: true,
      secure: false,
    });

    await UserCookies.createUserCookie(
      user.id,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt
    );

    await UserLogs.createUserLogs(
      user.id,
      user.email,
      'login',
      'Pengguna telah berhasil login'
    );

    return sendResponse(res, 200, 'success', 'Login berhasil', {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error in auth login controller: ', error.message);
    return sendResponse(res, 500, 'error', 'Server error');
  }
};
