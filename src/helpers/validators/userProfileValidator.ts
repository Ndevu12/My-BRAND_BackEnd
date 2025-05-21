import Joi from 'joi';
import { IUserProfile } from '../../models/userProfile';

/**
 * Validates user profile data
 * @param profileData The profile data to validate 
 * @returns Validation result with value or error
 */
export const validateUserProfile = (profileData: Partial<Omit<IUserProfile, 'user'>>): Joi.ValidationResult => {  const schema = Joi.object({
    firstName: Joi.string().min(1).max(50).allow(''),
    lastName: Joi.string().min(1).max(50).allow(''),
    bio: Joi.string().max(500).allow(''),
    avatarUrl: Joi.string().uri().allow('')
  });

  return schema.validate(profileData);
};

/**
 * Sanitize user profile data by removing any fields not in our model
 * @param profileData Raw profile data from request
 * @returns Sanitized profile data
 */
export const sanitizeProfileData = (profileData: any): Partial<Omit<IUserProfile, 'user'>> => {
  const sanitized: Partial<Omit<IUserProfile, 'user'>> = {};
  
  if (profileData.firstName !== undefined) sanitized.firstName = String(profileData.firstName);
  if (profileData.lastName !== undefined) sanitized.lastName = String(profileData.lastName);
  if (profileData.bio !== undefined) sanitized.bio = String(profileData.bio);
  if (profileData.avatarUrl !== undefined) sanitized.avatarUrl = String(profileData.avatarUrl);
  
  return sanitized;
};
