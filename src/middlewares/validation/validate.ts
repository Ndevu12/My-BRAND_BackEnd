import { Request, Response, NextFunction } from "express";
import validation from "../../helpers/validator";
import signupSchema from "./signup";
import subscribeSchema from "./subscription";
import createBlogSchema from "./blog";

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
