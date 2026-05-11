import express from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/:pollId', getAnalytics);

export default router;
