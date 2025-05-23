import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import response from "../helpers/response";
import UserServices from "../services/authServices";
import { verify } from "../helpers/jwtToken";

dotenv.config();

// Blacklisted tokens for logout
export const blackListedTokens = new Set<string>();

// Extend Request type to include user property
export interface CustomeRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  };
}

/**
 * AUTHENTICATION MIDDLEWARE
 * The application uses cookie-based authentication as the primary method.
 * JWT tokens are stored in HTTP-only cookies and automatically sent with each request.
 * Authorization header with Bearer token is supported as a fallback method.
 */

/**
 * Middleware to isAuth any user (admin or regular)
 */
export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token primarily from cookie, fallback to header if needed
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // Check if token exists
    if (!token) {
      response(res, 401, "Access denied. No token provided", null, "NO_TOKEN");
      return;
    }

    // Check if token is blacklisted (logged out)
    if (blackListedTokens.has(token)) {
      response(res, 401, "Token revoked. Please login again", null, "INVALID_TOKEN");
      return;
    }

    // Verify token and attach user to request
    const decoded = verify(token);
    (req as CustomeRequest).user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:");
    response(res, 401, "Invalid token", null, "INVALID_TOKEN");
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    isAuth(req, res, () => {
      const user = (req as CustomeRequest).user;
      if (!user || user?.role !== "admin") {
        response(
          res,
          403,
          "Access denied. Admin role required",
          null,
          "FORBIDDEN"
        );
        return;
      }
      next();
    });
  } catch (error) {
    console.error("Admin authentication error:");
    response(res, 500, "Something went wrong", null, "SERVER_ERROR");
  }
};

/**
 * AUTHORIZATION MIDDLEWARE
 */

/**
 * Middleware to check if user is admin or subscriber
 * This allows both admin users and regular users to access the route
 */
export const isAdminOrSubscriber = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    isAuth(req, res, () => {
      const user = (req as CustomeRequest).user;
      if (!user) {
        response(res, 401, "Authentication required", null, "UNAUTHORIZED");
        return;
      }

      // Allow both admin and regular users to proceed
      if (user.role === "admin" || user.role === "user") {
        next();
      } else {
        response(
          res,
          403,
          "Access denied. Invalid user role",
          null,
          "FORBIDDEN"
        );
      }
    });
  } catch (error) {
    console.error("Authorization error:", error);
    response(res, 500, "Something went wrong", null, "SERVER_ERROR");
  }
};

/**
 * Middleware to check if an admin already exists
 * Used to restrict admin creation when one already exists
 */
export const isAdminExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use findOne instead of getting all users and filtering
    const adminExists = await UserServices.findAdminUser();

    // If no admin exists, allow creating one
    if (!adminExists) {
      next();
      return;
    }    // Otherwise, check if the current user is already an admin
    response(
      res, 
      403, 
      "Action forbidden. Please try reading blogs on the website.", 
      null, 
      "ADMIN_EXISTS"
    );
  } catch (error) {
    console.error("Error checking admin existence:", error);
    response(
      res, 
      500, 
      "Something went wrong", 
      null, 
      "SERVER_ERROR"
    );
  }
};