import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

dotenv.config();

/**
 * Generate a hash for a password
 * @param password The plaintext password to hash
 * @returns The hashed password
 */
export const generate = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

/**
 * Check if a plaintext password matches a hash
 * @param password The plaintext password to check
 * @param hash The hash to check against
 * @returns True if the password matches the hash
 */
export const check = async (password: string, hash: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, hash);
  return match;
};
