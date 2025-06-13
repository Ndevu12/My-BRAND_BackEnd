import Joi from 'joi';
import { IMessage } from '../../models/messages';
import { IMessageCreateData } from '../../types/message.types';

/**
 * Validates message data for contact form submissions
 * @param messageData The message data to validate 
 * @returns Validation result with value or error
 */
export const validateMessage = (messageData: any): Joi.ValidationResult<IMessageCreateData> => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .trim()
      .messages({
        "any.required": "Name is required.",
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name cannot exceed 100 characters.",
        "string.base": "Name must be a string."
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .trim()
      .messages({
        "any.required": "Email is required.",
        "string.email": "Please enter a valid email address.",
        "string.base": "Email must be a string."
      }),
    subject: Joi.string()
      .min(3)
      .max(200)
      .required()
      .trim()
      .messages({
        "any.required": "Subject is required.",
        "string.min": "Subject must be at least 3 characters long.",
        "string.max": "Subject cannot exceed 200 characters.",
        "string.base": "Subject must be a string."
      }),
    message: Joi.string()
      .min(10)
      .max(2000)
      .required()
      .trim()
      .messages({
        "any.required": "Message is required.",
        "string.min": "Message must be at least 10 characters long.",
        "string.max": "Message cannot exceed 2000 characters.",
        "string.base": "Message must be a string."
      })
  });

  return schema.validate(messageData);
};

/**
 * Sanitize message data by removing any fields not in our model
 * @param messageData Raw message data from request
 * @returns Sanitized message data
 */
export const sanitizeMessageData = (messageData: any): IMessageCreateData => {
  const sanitized: IMessageCreateData = {
    name: String(messageData.name || '').trim(),
    email: String(messageData.email || '').trim().toLowerCase(),
    subject: String(messageData.subject || '').trim(),
    message: String(messageData.message || '').trim()
  };
  
  return sanitized;
};
