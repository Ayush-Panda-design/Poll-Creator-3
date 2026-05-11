/**
 * Google OIDC Configuration (optional)
 * ─────────────────────────────────────
 * This project handles Google auth via a direct token/profile exchange
 * from the frontend (using Google Identity Services SDK).
 *
 * To enable full server-side OIDC flow:
 * 1. Install: npm install openid-client
 * 2. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env
 * 3. Implement the flow using the openid-client library:
 *    https://github.com/panva/node-openid-client
 *
 * The current implementation uses the simpler approach:
 *   POST /api/auth/google  →  receives { googleId, email, name, avatar }
 *   from the frontend after Google sign-in, then issues a JWT.
 */

export {};
