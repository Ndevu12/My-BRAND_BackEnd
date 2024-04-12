import { Router } from 'express';
import AdminController from '../controllers/adminController.ts';
import { isAdmin } from '../middlewares/auth.ts';
import UserValidation from "../middlewares/validation/register.ts";

const router: Router = Router();

// Route to register a new admin
router.patch('/signup', UserValidation.signup, AdminController.registerAdmin);
router.get('/login', AdminController.loginAdmin);
router.patch('/logout', isAdmin, AdminController.registerAdmin);

// hijokl
export default router;
