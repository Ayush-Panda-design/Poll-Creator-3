import asyncHandler from '../utils/asyncHandler.js';
import { getAnalyticsService } from '../services/analytics.service.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const data = await getAnalyticsService(req.params.pollId, req.user._id);
  res.status(200).json({ success: true, ...data });
});
