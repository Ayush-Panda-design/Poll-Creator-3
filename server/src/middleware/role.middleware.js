import ApiError from '../utils/ApiError.js';
import { USER_ROLES } from '../constants/index.js';

/**
 * Restricts routes to admin users only.
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Access denied. Admins only.');
  }
  next();
};
