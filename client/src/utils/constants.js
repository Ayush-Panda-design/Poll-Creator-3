export const SOCKET_EVENTS = {
  JOIN_POLL:        'join_poll',
  LEAVE_POLL:       'leave_poll',
  NEW_RESPONSE:     'new_response',
  ANALYTICS_UPDATE: 'analytics_update',
  PARTICIPANT_COUNT:'participant_count',
  POLL_EXPIRED:     'poll_expired',
  POLL_PUBLISHED:   'poll_published',
};

export const POLL_STATUS = {
  ACTIVE:    'active',
  EXPIRED:   'expired',
  DRAFT:     'draft',
  PUBLISHED: 'published',
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

export const USER_ROLES = ['Teacher', 'Researcher', 'Business Owner', 'Event Organizer', 'Student', 'Other'];

export const API_URL = import.meta.env.VITE_API_URL || '/api';
