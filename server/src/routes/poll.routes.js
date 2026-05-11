import express from 'express';
import {
  createPoll,
  getUserPolls,
  getPollById,
  updatePoll,
  deletePoll,
  publishPoll,
  getPublicPoll,
  getPublicResults,
} from '../controllers/poll.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { createPollValidator, updatePollValidator } from '../validators/poll.validator.js';
import validate from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/public/:pollCode', getPublicPoll);
router.get('/public/results/:pollCode', getPublicResults);

// Protected routes
router.use(protect);
router.post('/', createPollValidator, validate, createPoll);
router.get('/', getUserPolls);
router.get('/:id', getPollById);
router.patch('/:id', updatePollValidator, validate, updatePoll);
router.delete('/:id', deletePoll);
router.post('/:id/publish', publishPoll);

export default router;
