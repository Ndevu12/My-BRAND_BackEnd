import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRETKEY;

// Ensure JWT secret is set
if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in the environment variables. This is a security risk.');
  process.exit(1);
}

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
