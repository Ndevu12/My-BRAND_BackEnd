import { Request, Response } from "express";
import { IUser } from "../models/user";
import { generate, check } from "../helpers/cryptoJs";
import { sign } from "../helpers/jwtToken";
import response from "../helpers/response";
import UserServices from "../services/authServices";
import { blackListedTokens } from "../middlewares/authUtils";

class UserController {

  /**
   * Register a regular user (non-admin)
   */
  static async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email } = req.body;

      // Check if username or email already exists
      const existingUser = await UserServices.findUserByCredentials(username, email);
      if (existingUser) {
        response(
          res, 
          409, 
          "Username or email already exists", 
          null, 
          "USER_ALREADY_EXISTS"
        );
        return;
      }

      // Hash the password
      const hashedPassword = await generate(password);

      // Create the new user with role user
      const userData = {
        ...req.body,
        password: hashedPassword,
        role: "user"
      };

      const user = await UserServices.createUser(userData);

      response(res, 201, "Registration successful", null);
    } catch (error) {
      console.error("Error registering user:", error);
      response(
        res,
        500,
        "Sorry, something went wrong during registration",
        null,
        "SERVER_ERROR"
      );
    }
  }

  /**
   * Login for any user (admin or regular)
   */
  static async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Validate required fields
      if (!username || !password) {
        response(
          res, 
          400, 
          "Username and password are required", 
          null, 
          "MISSING_CREDENTIALS"
        );
        return;
      }

      // Find the user by username
      const user = await UserServices.findUserByLogin(username);
      if (!user) {
        response(
          res,
          401,
          "Invalid username or password",
          null,
          "INVALID_CREDENTIALS"
        );
        return;
      }

      // Verify password
      const isPasswordValid = await check(password, user.password);
      if (!isPasswordValid) {
        response(
          res,
          401,
          "Invalid username or password",
          null,
          "INVALID_CREDENTIALS"
        );
        return;
      }

      // Generate JWT token
      const accessToken = sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      // Set cookie and send response
      res.cookie("token", accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: process.env.NODE_ENV === "production", // httpOnly in production
        secure: true,
        sameSite: "none",
        path: "/", // Available for all routes
      });

      response(res, 200, "Login successful", null);
    } catch (error) {
      console.error("Error during login:", error);
      response(
        res,
        500,
        "Sorry, something went wrong during login",
        null,
        "SERVER_ERROR"
      );
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // Get token from cookie first, then fallback to authorization header
      const token = 
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");
        
      if (!token) {
        response(res, 401, "No token provided", null, "TOKEN_MISSING");
        return;
      }

      // Add token to blacklist
      blackListedTokens.add(token);
      
      // Clear cookie with proper options
      res.clearCookie("token", {
        httpOnly: process.env.NODE_ENV === "production", // httpOnly in production,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      
      response(res, 200, "Logout successful", null);
    } catch (error) {
      console.error("Error during logout:", error);
      response(
        res,
        500,
        "Sorry, something went wrong during logout",
        null,
        "SERVER_ERROR"
      );
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = (req as any).user?.id;
      if (!userId) {
        response(res, 401, "Not authenticated", null, "NOT_AUTHENTICATED");
        return;
      }

      // Get user from database
      const user = await UserServices.getUserById(userId);
      if (!user) {
        response(res, 404, "User not found", null, "USER_NOT_FOUND");
        return;
      }

      // Return user data (excluding sensitive fields)
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      response(res, 200, "User profile retrieved successfully", userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      response(
        res,
        500,
        "Sorry, something went wrong retrieving your profile",
        null,
        "SERVER_ERROR"
      );
    }
  }

  /**
   * Delete all users (for testing purposes)
   */
  static async deleteAllUsers(req: Request, res: Response): Promise<void> {
    try {
      await UserServices.deleteAll();
      response(res, 200, "All users deleted successfully", null);
    } catch (error) {
      console.error("Error deleting users:", error);
      response(
        res,
        500,
        "Failed to delete all users",
        null,
        "SERVER_ERROR"
      );
    }
  }
}

export default UserController;
