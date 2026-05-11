/**
 * Wraps async route handlers to catch errors and pass them to Express error middleware.
 * Eliminates the need for try/catch in every controller.
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default asyncHandler;
