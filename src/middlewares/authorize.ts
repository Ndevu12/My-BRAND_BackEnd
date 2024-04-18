import { Request, Response, NextFunction, RequestHandler } from "express";
import { verify } from "../helpers/jwtToken.ts";
import response from "../helpers/response.ts";
import { blackListedTokens } from "./authentication.ts";

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
    if (!authHeader){ 
      console.log("Acess denied. Subscribe first to do this action");
      throw new Error("Acess denied. Subscribe/login first to do this action");
      }
    const token = authHeader.replace("Bearer ", "");

    if (blackListedTokens.has(token)) {
      console.log("Token blacklisted");
      res.status(403).json({ message: "Access denied. Your current TOKEN HAD BEEN blacklisted. Please log in again." });
      return;
    }
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
    response(res, 401, (error as Error).message || "Not Authorized to perform this action", null, "AUTHENTICATION_ERROR"
    );
    return;
  }
};
