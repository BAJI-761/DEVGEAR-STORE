import User from '../models/User.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

function createTokenCookies(res, userId, role) {
  const tokenPayload = { sub: userId, role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists'
        }
      });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password)
    });

    createTokenCookies(res, user._id.toString(), user.role);

    return res.status(201).json({
      success: true,
      data: {
        user: user.toJSON()
      },
      message: 'Account created successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    createTokenCookies(res, user._id.toString(), user.role);

    return res.json({
      success: true,
      data: {
        user: user.toJSON()
      },
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(_req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
}

export async function me(req, res) {
  return res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}