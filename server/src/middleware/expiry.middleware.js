import Poll from '../models/Poll.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { POLL_STATUS } from '../constants/index.js';

/**
 * Checks if the poll has expired before accepting a response.
 * Automatically marks the poll as expired in DB if needed.
 */
export const checkPollExpiry = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll) throw new ApiError(404, 'Poll not found');

  if (poll.status === POLL_STATUS.EXPIRED) {
    throw new ApiError(410, 'This poll has expired and no longer accepts responses.');
  }

  if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
    poll.status = POLL_STATUS.EXPIRED;
    await poll.save();
    throw new ApiError(410, 'This poll has expired and no longer accepts responses.');
  }

  req.poll = poll;
  next();
});
