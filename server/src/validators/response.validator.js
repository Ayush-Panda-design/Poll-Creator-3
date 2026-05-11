import { body } from 'express-validator';

export const submitResponseValidator = [
  body('answers').isArray({ min: 1 }).withMessage('Answers array is required'),
  body('answers.*.questionIndex').isInt({ min: 0 }).withMessage('Valid question index required'),
  body('answers.*.selectedOption').optional().isString(),
];
