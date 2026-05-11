/** Validate email format */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Validate password strength */
export const isValidPassword = (pw) => pw?.length >= 6;

/** Validate poll form */
export const validatePoll = (data) => {
  const errors = {};
  if (!data.title?.trim()) errors.title = 'Poll title is required';
  if (!data.questions?.length) errors.questions = 'Add at least one question';
  data.questions?.forEach((q, i) => {
    if (!q.question?.trim()) errors[`q_${i}`] = `Question ${i + 1} text required`;
    if (!q.options?.filter(Boolean).length >= 2)
      errors[`q_${i}_opts`] = `Question ${i + 1} needs at least 2 options`;
  });
  return errors;
};
