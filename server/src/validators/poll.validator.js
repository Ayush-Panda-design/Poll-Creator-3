import { body } from 'express-validator';

export const createPollValidator = [
  body('title').trim().notEmpty().withMessage('Poll title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.question').trim().notEmpty().withMessage('Question text is required'),
  body('questions.*.options').isArray({ min: 2 }).withMessage('Each question needs at least 2 options'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiry date format'),
];

export const updatePollValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('questions').optional().isArray({ min: 1 }).withMessage('At least one question required'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiry date format'),
];
