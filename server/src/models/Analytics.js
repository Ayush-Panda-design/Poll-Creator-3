import mongoose from 'mongoose';

const questionStatSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number },
    questionText: { type: String },
    options: [String],
    optionCounts: { type: Map, of: Number, default: {} },
    optionPercentages: { type: Map, of: Number, default: {} },
    totalAnswered: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true, unique: true },
    totalResponses: { type: Number, default: 0 },
    questionStats: { type: [questionStatSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
