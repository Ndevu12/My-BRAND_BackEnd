import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get JWT secret from environment or use a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Sign a JWT token with user data
 * @param payload Data to include in the token
 * @returns Signed JWT token
 */
export const sign = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns Decoded token payload
 */
export const verify = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
