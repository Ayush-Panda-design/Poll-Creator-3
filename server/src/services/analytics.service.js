import Analytics from '../models/Analytics.js';
import Poll from '../models/Poll.js';
import ApiError from '../utils/ApiError.js';
import calculateAnalytics from '../utils/calculateAnalytics.js';

export const getAnalyticsService = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, 'Poll not found');
  if (poll.createdBy.toString() !== userId.toString())
    throw new ApiError(403, 'Not authorised to view analytics for this poll');

  // Recalculate fresh stats
  const stats = await calculateAnalytics(pollId);

  // Persist latest
  const analytics = await Analytics.findOneAndUpdate(
    { pollId },
    { totalResponses: stats.totalResponses, questionStats: stats.questionStats, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  return { poll, analytics, stats };
};
