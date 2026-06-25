import 'dotenv/config';

export const betterAuthConfig = {
  url: process.env.BETTER_AUTH_URL ?? 'http://localhost:9009',
  secret: process.env.BETTER_AUTH_SECRET ?? 'change-me-at-least-16-chars!!',
  trustedOrigins: (process.env.TRUSTED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0),
};
