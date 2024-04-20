import { Router } from "express";
import UserController from "../controllers/userController";
import { isAdmin } from "../middlewares/authentication";
import UserValidation from "../middlewares/validation/validate";
import { isAdminExist } from "../middlewares/isAdminExist";

const adminRoutes: Router = Router();

// Route to register a new admin
adminRoutes.post(
  "/signup",
  isAdminExist,
  UserValidation.signup,
  UserController.registerAdmin
);
adminRoutes.get("/login", UserController.loginAdmin);
adminRoutes.post("/logout", UserController.logout);
adminRoutes.get("/deleteAll", isAdmin, UserController.deleteAllUser);

// adminRoutes.post('/signup', UserValidation.signup, UserController.registerAdmin);
// adminRoutes.get('/login', UserController.loginAdmin);
// adminRoutes.post('/logout', UserController.logout)
// adminRoutes.get('/deleteAll', UserController.deleteAllUser);

// hijokl
export default adminRoutes;
