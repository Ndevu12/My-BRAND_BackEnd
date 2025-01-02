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
adminRoutes.post("/login", UserController.loginAdmin);
adminRoutes.post("/logout", UserController.logout);
adminRoutes.put("/delete/All", isAdmin, UserController.deleteAllUser);


export default adminRoutes;
