import { Request, Response, NextFunction, RequestHandler } from "express";
import { verify } from "../helpers/jwt.ts";
import response from "../helpers/response.ts";

// ...

export interface DecodedUser {
  role: string;
  id: string;
  username: string;
  email: string;
}

export interface CustomeRequest extends Request {
  user?: DecodedUser;
}

export const isAdmin: RequestHandler = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) throw new Error("Acess denied");
    const token = authHeader.replace("Bearer ", "");
    const user = verify(token) as DecodedUser;

    if (user.role !== "admin") {
      response(res, 403, "Acess denied", null, "FORBIDDEN");
      return;
    }
    req.user = user;
    return next();
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
