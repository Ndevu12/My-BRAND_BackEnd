import { Request, Response, NextFunction } from 'express';
import { validateUser, validateLogin } from './userValidator';
import { validateMessage, sanitizeMessageData } from './messageValidator';
import response from '../response';

class UserValidation {
  /**
   * Middleware to validate user signup
   */
  static signup(req: Request, res: Response, next: NextFunction) {
    const { error } = validateUser(req.body);
    if (error) {
      return response(
        res,
        400,
        error.details[0].message,
        null,
        "VALIDATION_ERROR"
      );
    }
    return next();
  }

  /**
   * Middleware to validate user login
   */
  static login(req: Request, res: Response, next: NextFunction) {
    const { error } = validateLogin(req.body);
    if (error) {
      return response(
        res,
        400,
        error.details[0].message,
        null,
        "VALIDATION_ERROR"
      );
    }
    return next();
  }
  /**
   * Middleware to validate message data for contact form
   */
  static message(req: Request, res: Response, next: NextFunction): void {
    // Sanitize the data first
    const sanitizedData = sanitizeMessageData(req.body);
    
    // Validate the sanitized data
    const { error } = validateMessage(sanitizedData);
    if (error) {
      response(
        res,
        400,
        error.details[0].message,
        null,
        "VALIDATION_ERROR"
      );
      return;
    }
    
    // Replace request body with sanitized data
    req.body = sanitizedData;
    next();
  }
}

export default UserValidation;
