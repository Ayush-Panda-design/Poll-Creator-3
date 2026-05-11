import asyncHandler from '../utils/asyncHandler.js';
import { submitResponseService, getResponsesService } from '../services/response.service.js';
import { emitNewResponse } from '../services/socket.service.js';

export const submitResponse = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const userId = req.user?._id || null;
  const ipAddress = req.ip;

  const { response, analytics } = await submitResponseService(
    req.params.pollId,
    answers,
    userId,
    ipAddress
  );

  // Emit real-time update
  emitNewResponse(req.params.pollId, analytics);

  res.status(201).json({ success: true, message: 'Response submitted successfully', response });
});

export const getResponses = asyncHandler(async (req, res) => {
  const responses = await getResponsesService(req.params.pollId, req.user._id);
  res.status(200).json({ success: true, responses });
});
