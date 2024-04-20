import { Router } from 'express';
import UserController from '../controllers/userController.ts';
import { isAdmin } from '../middlewares/authentication.ts';
import UserValidation from "../middlewares/validation/validate.ts";
import { isAdminExist } from '../middlewares/isAdminExist.ts';

const adminRoutes: Router = Router();

// Route to register a new admin
// adminRoutes.post('/signup', isAdminExist, UserValidation.signup, UserController.registerAdmin);
// adminRoutes.get('/login', UserController.loginAdmin);
// adminRoutes.post('/logout', UserController.logout)
// adminRoutes.get('/deleteAll', isAdmin , UserController.deleteAllUser);

adminRoutes.post('/signup', UserValidation.signup, UserController.registerAdmin);
adminRoutes.get('/login', UserController.loginAdmin);
adminRoutes.post('/logout', UserController.logout)
adminRoutes.get('/deleteAll', UserController.deleteAllUser);

// hijokl
export default adminRoutes;
