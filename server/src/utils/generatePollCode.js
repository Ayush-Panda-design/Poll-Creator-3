import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique, short poll code (first 8 chars of a UUID).
 * Used to create shareable poll links.
 * @returns {string} Poll code e.g. "a1b2c3d4"
 */
const generatePollCode = () => {
  return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
};

export default generatePollCode;
