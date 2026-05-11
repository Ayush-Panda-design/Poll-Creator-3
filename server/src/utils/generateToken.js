import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT token for a given user ID.
 * @param {string} userId - The MongoDB user ID
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
