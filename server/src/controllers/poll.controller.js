import asyncHandler from '../utils/asyncHandler.js';
import {
  createPollService,
  getUserPollsService,
  getPollByIdService,
  updatePollService,
  deletePollService,
  publishPollService,
  getPublicPollService,
  getPublicResultsService,
} from '../services/poll.service.js';
import { emitPollPublished } from '../services/socket.service.js';

export const createPoll = asyncHandler(async (req, res) => {
  const poll = await createPollService(req.body, req.user._id);
  res.status(201).json({ success: true, poll });
});

export const getUserPolls = asyncHandler(async (req, res) => {
  const polls = await getUserPollsService(req.user._id);
  res.status(200).json({ success: true, polls });
});

export const getPollById = asyncHandler(async (req, res) => {
  const poll = await getPollByIdService(req.params.id, req.user._id);
  res.status(200).json({ success: true, poll });
});

export const updatePoll = asyncHandler(async (req, res) => {
  const poll = await updatePollService(req.params.id, req.user._id, req.body);
  res.status(200).json({ success: true, poll });
});

export const deletePoll = asyncHandler(async (req, res) => {
  await deletePollService(req.params.id, req.user._id);
  res.status(200).json({ success: true, message: 'Poll deleted' });
});

export const publishPoll = asyncHandler(async (req, res) => {
  const poll = await publishPollService(req.params.id, req.user._id);
  emitPollPublished(poll._id.toString());
  res.status(200).json({ success: true, poll });
});

export const getPublicPoll = asyncHandler(async (req, res) => {
  const poll = await getPublicPollService(req.params.pollCode);
  res.status(200).json({ success: true, poll });
});

export const getPublicResults = asyncHandler(async (req, res) => {
  const data = await getPublicResultsService(req.params.pollCode);
  res.status(200).json({ success: true, ...data });
});
