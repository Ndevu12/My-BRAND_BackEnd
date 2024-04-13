import { Router } from 'express';
import AdminController from '../controllers/adminController.ts';
import { isAdmin } from '../middlewares/auth.ts';
import UserValidation from "../middlewares/validation/register.ts";

const adminRoutes: Router = Router();

// Route to register a new admin
adminRoutes.patch('/signup', UserValidation.signup, AdminController.registerAdmin);
adminRoutes.get('/login', AdminController.loginAdmin);
adminRoutes.patch('/logout', isAdmin, AdminController.registerAdmin);

// hijokl
export {adminRoutes };
