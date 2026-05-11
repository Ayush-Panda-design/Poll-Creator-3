import mongoose from 'mongoose';
import { POLL_STATUS } from '../constants/index.js';

const optionSchema = new mongoose.Schema({ text: { type: String, required: true, trim: true } }, { _id: false });

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true, validate: [(arr) => arr.length >= 2, 'At least 2 options required'] },
    required: { type: Boolean, default: true },
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAnonymous: { type: Boolean, default: true },
    requiresAuth: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false },
    pollCode: { type: String, required: true, unique: true, uppercase: true },
    status: { type: String, enum: Object.values(POLL_STATUS), default: POLL_STATUS.ACTIVE },
    questions: { type: [questionSchema], validate: [(arr) => arr.length >= 1, 'At least 1 question required'] },
    totalResponses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-expire check
pollSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
};

const Poll = mongoose.model('Poll', pollSchema);
export default Poll;
