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
            const { username, password, email, phoneNumber, fullName } = req.body;
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
            const { account, password } = req.body;
            const user = await UserServices.getSingleUser({
              $or: [{ username: account }, { email: account }],
            });
      

            if (!user) {
                response(res, 404, "Invalid username or password", null, "USER_NOT_FOUND");
                return;
            }

            if (!user.password) {
                response(res, 401, "Password is not set for this account", null, "UNAUTHORIZED");
                return;
            }
            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

            // Send authorization code via email and phone
            const isCodeSent = await sendAuthorizationCodeByEmailAndPhone(user.email, user.phoneNumber);

            const accessToken = sign({
                id: user._id,
                email: user.email,
                role: user.role,
              });
        
              const userObject = user.toObject();
              userObject.accessToken = accessToken;
              delete userObject.password;
            if (isCodeSent) {
                res.status(200).json({ token, message: 'Authorization code sent successfully' });
            } else {
                res.status(500).json({ error: 'Failed to send authorization code' });
            }
        } catch (error) {
            console.error('Error logging in admin:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default UserController;
