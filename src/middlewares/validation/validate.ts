import { Request, Response, NextFunction } from "express";
import validation from "../../helpers/validator.ts";
import signupSchema from "./signup.ts";

class UserValidation {
  static signup(req: Request, res: Response, next: NextFunction) {
    validation(signupSchema, req.body, res, next);
  }
}

export default UserValidation;
