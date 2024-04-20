import { Request, Response, NextFunction, RequestHandler } from "express";
import { verify } from "../helpers/jwtToken";
import response from "../helpers/response";

// ...

export const blackListedTokens = new Set<string>();
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
    if (!authHeader) {
      console.log(
        "Acess denied, You are not allowed to perform this action. Please"
      );
      throw new Error(
        "Acess denied, You are not allowed to perform this action. Please "
      );
    }
    const token = authHeader.replace("Bearer ", "");

    if (blackListedTokens.has(token)) {
      console.log("Token blacklisted");
      res
        .status(403)
        .json({
          message:
            "Access denied. Your current TOKEN HAD BEEN blacklisted. Please log in again.",
        });
      return;
    }

    const user = verify(token) as DecodedUser;

    if (user.role !== "admin") {
      console.log("Acess denied. You are not an ADMIN");
      response(
        res,
        403,
        "Acess denied. You are not an ADMIN",
        null,
        "FORBIDDEN"
      );
      return;
    }
    req.user = user;
    return next();
  } catch (error) {
    response(
      res,
      401,
      (error as Error).message || "Not Authorized TO perform this action",
      null,
      "AUTHENTICATION_ERROR"
    );
    return;
  }
};
