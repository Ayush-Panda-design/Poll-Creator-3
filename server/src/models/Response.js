import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    questionText: { type: String },
    selectedOption: { type: String, default: null },
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    respondent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    answers: { type: [answerSchema], required: true },
    submittedAt: { type: Date, default: Date.now },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

const Response = mongoose.model('Response', responseSchema);
export default Response;
