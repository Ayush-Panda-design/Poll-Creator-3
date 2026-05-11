import Poll from '../models/Poll.js';
import Analytics from '../models/Analytics.js';
import generatePollCode from '../utils/generatePollCode.js';
import ApiError from '../utils/ApiError.js';
import { POLL_STATUS } from '../constants/index.js';

export const createPollService = async (data, userId) => {
  let pollCode;
  let exists = true;
  // Ensure poll code is unique
  while (exists) {
    pollCode = generatePollCode();
    exists = await Poll.findOne({ pollCode });
  }

  const poll = await Poll.create({ ...data, createdBy: userId, pollCode });

  // Create empty analytics record
  await Analytics.create({ pollId: poll._id });

  return poll;
};

export const getUserPollsService = async (userId) => {
  return Poll.find({ createdBy: userId }).sort({ createdAt: -1 });
};

export const getPollByIdService = async (pollId, userId) => {
  const poll = await Poll.findById(pollId).populate('createdBy', 'name email');
  if (!poll) throw new ApiError(404, 'Poll not found');
  if (poll.createdBy._id.toString() !== userId.toString())
    throw new ApiError(403, 'Not authorised to view this poll');
  return poll;
};

export const updatePollService = async (pollId, userId, updates) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, 'Poll not found');
  if (poll.createdBy.toString() !== userId.toString())
    throw new ApiError(403, 'Not authorised to update this poll');

  Object.assign(poll, updates);
  await poll.save();
  return poll;
};

export const deletePollService = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, 'Poll not found');
  if (poll.createdBy.toString() !== userId.toString())
    throw new ApiError(403, 'Not authorised to delete this poll');

  await poll.deleteOne();
  await Analytics.deleteOne({ pollId });
};

export const publishPollService = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, 'Poll not found');
  if (poll.createdBy.toString() !== userId.toString())
    throw new ApiError(403, 'Not authorised');

  poll.isPublished = true;
  poll.status = POLL_STATUS.PUBLISHED;
  await poll.save();
  return poll;
};

export const getPublicPollService = async (pollCode) => {
  const poll = await Poll.findOne({ pollCode }).select('-createdBy');
  if (!poll) throw new ApiError(404, 'Poll not found');

  if (poll.isExpired()) {
    poll.status = POLL_STATUS.EXPIRED;
    await poll.save();
    throw new ApiError(410, 'This poll has expired');
  }

  return poll;
};

export const getPublicResultsService = async (pollCode) => {
  const poll = await Poll.findOne({ pollCode });
  if (!poll) throw new ApiError(404, 'Poll not found');
  if (!poll.isPublished) throw new ApiError(403, 'Results not yet published');

  const analytics = await Analytics.findOne({ pollId: poll._id });
  return { poll, analytics };
};
