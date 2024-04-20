import { Request, Response } from "express";
import { User, IUser } from "../models/user";
import jwt from "jsonwebtoken";
import { sendAuthorizationCodeByEmailAndPhone } from "../utils/authorizationUtils";
import { generate, check } from "../helpers/cryptoJs";
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

      const strongPassward = await generate(password);

      const newUser = { ...req.body };
      newUser.password = strongPassward;

      const user = await UserServices.userSignup(newUser);

      const accessToken = sign({
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      });

      const userObject: any = {
        username: user.username,
      };
      userObject.accessToken = accessToken;

      res.cookie("token", accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      response(res, 201, "Signed up successful", userObject);
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

  // Method to login admin
  static async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Check if username is badly formatted
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(username)) {
        response(
          res,
          400,
          "Badly formatted username. Only alphanumeric characters are allowed.",
          null,
          "BAD_USERNAME_FORMAT"
        );
        return;
      }

      // Check if password is badly formatted
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        response(
          res,
          400,
          "Badly formatted password. It should contain minimum eight characters, at least one letter and one number.",
          null,
          "BAD_PASSWORD_FORMAT"
        );
        return;
      }
      const user = await UserServices.getSingleUser({
        $or: [{ username: username }, { passward: password }],
      });

      if (!user) {
        response(
          res,
          401,
          "Invalid username or password",
          null,
          "USER_NOT_FOUND"
        );
        return;
      }

      // Send authorization code via email and phone
      // const isCodeSent = await sendAuthorizationCodeByEmailAndPhone(user.email, user.phoneNumber);

      const accessToken = sign({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      const userObject: any = {
        username: user.username,
      };

      userObject.accessToken = accessToken;

      // if (isCodeSent) {
      //   console.log("Authorization code sent successfully")
      //     res.status(200).json({ token, message: 'Authorization code sent successfully' });
      // } else {
      //   console.log("Failed to send authorization")
      //     res.status(500).json({ error: 'Failed to send authorization code' });
      // }

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
