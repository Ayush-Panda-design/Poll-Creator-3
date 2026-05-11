import express from 'express';
import { signup, login, googleAuth, getMe, logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { signupValidator, loginValidator } from '../validators/auth.validator.js';
import validate from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
