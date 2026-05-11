import asyncHandler from '../utils/asyncHandler.js';
import { signupService, loginService, googleAuthService } from '../services/auth.service.js';
import { COOKIE_OPTIONS } from '../constants/index.js';

const sendTokenResponse = (res, token, user, statusCode = 200) => {
  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(statusCode).json({ success: true, token, user });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { token, user } = await signupService({ name, email, password });
  sendTokenResponse(res, token, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginService({ email, password });
  sendTokenResponse(res, token, user);
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { googleId, email, name, avatar } = req.body;
  const { token, user } = await googleAuthService({ googleId, email, name, avatar });
  sendTokenResponse(res, token, user);
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
