import 'dotenv/config';
export const jwtSecret = process.env.JWT_SECRET || 'mySecret';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
export const accessKeyToken = process.env.ACCESS_KEY_TOKEN || 'accessToken';
