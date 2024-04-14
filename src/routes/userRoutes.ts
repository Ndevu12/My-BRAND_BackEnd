import { Router } from 'express';
import UserController from '../controllers/userController.ts';
import { isAdmin } from '../middlewares/auth.ts';
import UserValidation from "../middlewares/validation/register.ts";

const adminRoutes: Router = Router();

// Route to register a new admin
adminRoutes.patch('/signup', UserValidation.signup, UserController.registerAdmin);
adminRoutes.get('/login', UserController.loginAdmin);
adminRoutes.patch('/logout', isAdmin, UserController.registerAdmin);

// hijokl
export default adminRoutes;
