import { Request, Response } from 'express';
import {User,  IUser } from '../models/user.ts';
import jwt from 'jsonwebtoken';
import { sendAuthorizationCodeByEmailAndPhone } from '../utils/authorizationUtils.ts';
import { generate, check } from "../helpers/cryptoJs";
import { sign } from "../helpers/jwt";
import response from "../helpers/response";
import UserServices from '../services/userServices.ts';

class UserController {
    static async registerAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, email } = req.body;
            const existingAdmin = await User.findOne({ $or: [{ username }, { email }] });
            if (existingAdmin) {
                res.status(400).json({ message: 'Username or email already exists' });
                return;
            }

          const hashedPassword = await generate(password);

          const newUser = { ...req.body, password: hashedPassword };

          const user = await UserServices.userSignup(newUser);

          user.password = undefined;
          
          const accessToken = sign({
            id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
          });
    
          const userObject = user.toObject();
          userObject.accessToken = accessToken;

         res.cookie('token', accessToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    
          response(res, 201, "Signup successful", userObject);
        } catch (error) {
          response(
            res,
            500,
            (error as Error).message || "Internal Server Error",
            null,
            "SERVER_ERROR"
          );
        }
    }

    // Method to login admin
    static async loginAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const user = await UserServices.getSingleUser({
              $or: [{ username: username }, { passward: password }],
            });
      

            if (!user) {
                response(res, 404, "Invalid username or password", null, "USER_NOT_FOUND");
                return;
            }

            if (!user.password) {
                response(res, 401, "Password not set", null, "UNAUTHORIZED");
                return;
            }

            // Send authorization code via email and phone
            // const isCodeSent = await sendAuthorizationCodeByEmailAndPhone(user.email, user.phoneNumber);

            const accessToken = sign({
                id: user._id,
                email: user.email,
                role: user.role,
              });
        
              const userObject = user.toObject();
              userObject.accessToken = accessToken;
              delete userObject.password;



            // if (isCodeSent) {
            //   console.log("Authorization code sent successfully")
            //     res.status(200).json({ token, message: 'Authorization code sent successfully' });
            // } else {
            //   console.log("Failed to send authorization")
            //     res.status(500).json({ error: 'Failed to send authorization code' });
            // }

           response(res, 200, "logedin successful", userObject);
        } catch (error) {
            console.error('Error logging in admin:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async deleteAllUser(req: Request, res: Response): Promise<void> {
      try {
        const deleteUsers = await UserServices.deleteAll();

        if (deleteUsers){
          console.log("All users deleted successfully");
          res.status(200).json({ message: 'All users deleted successfully' });
        } else {
          console.log("Failed to delete all users");
        }
      } catch (err){
        console.log("Error while deleting all users", err);
        response(res, 500, "Failed to delete all users", null, "FAILED_TO_DELETE_ALL_USERS");
      }
    }
}

export default UserController;
