import { Request, Response, NextFunction, RequestHandler } from "express";
import { verify } from "../helpers/jwtToken";
import response from "../helpers/response";

export const blackListedTokens = new Set<string>();
export interface DecodedUser {
  role: string;
  userId: string;
  username: string;
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
        "Acess denied, No Authorization header found in the request."
      );
      throw new Error(
        "Acess denied, Please log in first."
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
      console.log("Acess denied. User not an ADMIN");
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
    console.log("Failed to authenticate user: ", (error as Error).message);
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
