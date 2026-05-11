import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const updateOnboarding = asyncHandler(async (req, res) => {
  // `occupation` = what the user does (Teacher, Researcher …)
  // `interests`  = what they'll use the platform for
  const { interests, role: occupation } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { occupation, interests, onboardingCompleted: true },
    { new: true, runValidators: false }
  );
  res.status(200).json({ success: true, user });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json({ success: true, user });
});
