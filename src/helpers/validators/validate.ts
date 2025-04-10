import { Request, Response, NextFunction } from 'express';
import { validateUser, validateLogin } from './userValidator';
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
}

export default UserValidation;
