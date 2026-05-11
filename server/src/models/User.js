import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { AUTH_PROVIDERS, USER_ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    authProvider: { type: String, enum: Object.values(AUTH_PROVIDERS), default: AUTH_PROVIDERS.LOCAL },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER },
    occupation: { type: String, default: '' }, // onboarding role selection
    avatar: { type: String, default: '' },
    interests: [{ type: String }],
    onboardingCompleted: { type: Boolean, default: false },
    googleId: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password to hashed
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
