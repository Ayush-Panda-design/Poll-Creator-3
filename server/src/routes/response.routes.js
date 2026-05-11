import express from 'express';
import { submitResponse, getResponses } from '../controllers/response.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';
import { checkPollExpiry } from '../middleware/expiry.middleware.js';
import { submitResponseValidator } from '../validators/response.validator.js';
import validate from '../middleware/validation.middleware.js';

const router = express.Router();

// Submit response — optional auth (supports anonymous)
router.post('/:pollId', optionalAuth, checkPollExpiry, submitResponseValidator, validate, submitResponse);

// Get all responses for a poll — creator only
router.get('/:pollId', protect, getResponses);

export default router;
