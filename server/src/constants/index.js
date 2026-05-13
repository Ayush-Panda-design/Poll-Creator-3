// Application-wide constants

export const POLL_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

export const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const USER_INTERESTS = [
  'Education',
  'Business',
  'Research',
  'Events',
  'Marketing',
  'HR & Recruitment',
  'Product Feedback',
  'Other',
];

export const SOCKET_EVENTS = {
  JOIN_POLL: 'join_poll',
  LEAVE_POLL: 'leave_poll',
  NEW_RESPONSE: 'new_response',
  ANALYTICS_UPDATE: 'analytics_update',
  PARTICIPANT_COUNT: 'participant_count',
  POLL_EXPIRED: 'poll_expired',
  POLL_PUBLISHED: 'poll_published',
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
