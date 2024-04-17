import { Request, Response, NextFunction, RequestHandler } from "express";
import { verify } from "../helpers/jwt.ts";
import response from "../helpers/response.ts";

// ...

export interface DecodedUser {
  role: string;
  id: string;
  email: string;
}

export interface Authorize extends Request {
  user?: DecodedUser;
}

export const isAdminOrSubscriber: RequestHandler = async (
  req: Authorize,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new Error("Acess denied");
    const token = authHeader.replace("Bearer ", "");
    const user = verify(token) as DecodedUser;

    if (user.role === "admin" || user.role === "subscriber") {
      req.user = user;
      return next();
    }
    else {
      response(res, 403, "Please subscribe first. Access Denied", null, "FORBIDDEN");
      return;
    }
  } catch (error) {
    response(
      res,
      401,
      (error as Error).message || "Not Authorized",
      null,
      "AUTHENTICATION_ERROR"
    );
    return;
  }
};
