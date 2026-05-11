import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';
import { AUTH_PROVIDERS, COOKIE_OPTIONS } from '../constants/index.js';

/**
 * Registers a new local user, returns token + user.
 */
export const signupService = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password, authProvider: AUTH_PROVIDERS.LOCAL });
  const token = generateToken(user._id);
  return { token, user };
};

/**
 * Logs in a local user, validates password, returns token + user.
 */
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || user.authProvider !== AUTH_PROVIDERS.LOCAL)
    throw new ApiError(401, 'Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = generateToken(user._id);
  const safeUser = user.toObject();
  delete safeUser.password;
  return { token, user: safeUser };
};

/**
 * Finds or creates a user from Google OAuth data.
 */
export const googleAuthService = async ({ googleId, email, name, avatar }) => {
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatar,
      authProvider: AUTH_PROVIDERS.GOOGLE,
      onboardingCompleted: false,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.authProvider = AUTH_PROVIDERS.GOOGLE;
    await user.save();
  }

  const token = generateToken(user._id);
  return { token, user };
};
