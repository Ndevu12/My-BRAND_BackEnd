import { Router } from 'express';
import UserController from '../controllers/userController.ts';
import { isAdmin } from '../middlewares/auth.ts';
import UserValidation from "../middlewares/validation/validate.ts";

const adminRoutes: Router = Router();

// Route to register a new admin
adminRoutes.post('/signup', UserValidation.signup, UserController.registerAdmin);
adminRoutes.get('/login', UserController.loginAdmin);
adminRoutes.post('/logout', UserController.registerAdmin);

// hijokl
export default adminRoutes;
