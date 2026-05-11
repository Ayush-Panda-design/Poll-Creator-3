import mongoose from 'mongoose';

/**
 * Calculates analytics for a given poll from its responses.
 * Returns total responses and per-question option vote counts.
 * @param {string} pollId - The poll's MongoDB ID
 * @returns {Object} Analytics object { totalResponses, questionStats }
 */
const calculateAnalytics = async (pollId) => {
  const Response = mongoose.model('Response');
  const Poll = mongoose.model('Poll');

  const poll = await Poll.findById(pollId);
  if (!poll) return null;

  const responses = await Response.find({ pollId });

  const totalResponses = responses.length;

  // Build per-question stats
  const questionStats = poll.questions.map((question, qIndex) => {
    const optionCounts = {};
    question.options.forEach((opt) => {
      optionCounts[opt] = 0;
    });

    responses.forEach((response) => {
      const answer = response.answers.find(
        (a) => a.questionIndex === qIndex
      );
      if (answer && answer.selectedOption) {
        optionCounts[answer.selectedOption] =
          (optionCounts[answer.selectedOption] || 0) + 1;
      }
    });

    const totalForQuestion = Object.values(optionCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Compute percentages
    const optionPercentages = {};
    Object.entries(optionCounts).forEach(([opt, count]) => {
      optionPercentages[opt] =
        totalForQuestion > 0
          ? Math.round((count / totalForQuestion) * 100)
          : 0;
    });

    return {
      questionIndex: qIndex,
      questionText: question.question,
      options: question.options,
      optionCounts,
      optionPercentages,
      totalAnswered: totalForQuestion,
      skipped: totalResponses - totalForQuestion,
    };
  });

  return { totalResponses, questionStats };
};

export default calculateAnalytics;
