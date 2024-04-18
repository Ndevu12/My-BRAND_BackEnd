import { Request, Response, NextFunction } from "express";
import validation from "../../helpers/validator.ts";
import signupSchema from "./signup.ts";
import subscribeSchema from "./subscription.ts";
import createBlogSchema from "./blog.ts";

class UserValidation {
  static signup(req: Request, res: Response, next: NextFunction) {
    validation(signupSchema, req.body, res, next);
  }

  static subscribe(req: Request, res: Response, next: NextFunction) {
    validation(subscribeSchema, req.body, res, next);
  }

  static newBlog(req: Request, res: Response, next: NextFunction) {
    validation(createBlogSchema, req.body, res, next);
  }
}

export default UserValidation;