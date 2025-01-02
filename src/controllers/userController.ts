import { Request, Response } from "express";
import { User, IUser } from "../models/user";
import { check } from "../helpers/cryptoJs";
import { sign } from "../helpers/jwtToken";
import response from "../helpers/response";
import UserServices from "../services/userServices";
import { blackListedTokens } from "../middlewares/authentication";

class UserController {
  static async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email } = req.body;

      const existingAdmin = await User.findOne({
        $or: [{ username }, { email }, { password }],
      });
      if (existingAdmin) {
        res
          .status(400)
          .json({ message: "Username, password or email already exists" });
        return;
      }

      const newUser = { ...req.body };

      const user = await UserServices.userSignup(newUser);

      response(res, 201, "Signed up successful");
    } catch (error) {
      response(
        res,
        500,
        (error as Error).message || "Soryy, something went wrong",
        null,
        "SERVER_ERROR"
      );
    }
  }

  // API to login admin
  static async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        console.log('Username and password are required');
        response(
          res,
          400,
          "Username and password are required",
          null,
          "MISSING_CREDENTIALS"
        );
        return;
      }
      const user = await UserServices.getUserByUsername(username);

      if (!user) {
        console.log("User not found");
        response(
          res, 
          401, 
          "Invalid username or password",
          null,
          "USER_NOT_FOUND"
        );
        return;
      }

      const isPasswordValid = await check(password, user.password);  

      if (!isPasswordValid) {
        console.log('Invalid username or password.')
        response(
          res,
          401,
          "Invalid username or password",
          null,
          "INVALID_CREDENTIALS"
        );
        return;
      }

      const accessToken = sign({
        role: user.role,
        userId: user._id,
        username: user.username,
      });

      const userObject: any = {
        username: user.username,
      };

      userObject.accessToken = accessToken;

      res.cookie("token", accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      response(res, 200, "logged in successful", userObject);
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ error: "Sorry, Something went wrong" });
    }
  }

  // logout method

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) throw new Error("Access denied");

      blackListedTokens.add(token);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Sorry, Token required." });
    }
  }

  // delete all users when needed.

  static async deleteAllUser(req: Request, res: Response): Promise<void> {
    try {
      const deleteUsers = await UserServices.deleteAll();

      if (deleteUsers) {
        console.log("All users deleted successfully");
        res.status(200).json({ message: "All users are deleted successfully" });
      } else {
        console.log("Failed to delete all users");
      }
    } catch (err) {
      console.log("Error while deleting all users", err);
      response(
        res,
        500,
        "Failed to delete all users",
        null,
        "FAILED_TO_DELETE_ALL_USERS"
      );
    }
  }
}

export default UserController;
