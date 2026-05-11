import express from 'express';
import { updateOnboarding, getProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.patch('/onboarding', updateOnboarding);
router.get('/profile', getProfile);

export default router;
