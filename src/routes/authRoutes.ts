import { Router } from "express";
import UserController from "../controllers/authController";
import { isAdmin, isAdminExist } from "../middlewares/authUtils";

const authRoutes: Router = Router();

// Admin routes
authRoutes.post(
  "/admin/signup",
  isAdminExist,
  UserController.registerAdmin
);

// User routes (both admin and regular users)
authRoutes.post("/signup",  UserController.registerUser);
authRoutes.post("/login", UserController.loginUser);
authRoutes.post("/logout", UserController.logout);
authRoutes.get("/me", isAdmin, UserController.getCurrentUser);

// Testing/cleanup route (protected)
authRoutes.delete("/users", isAdmin, UserController.deleteAllUsers);

export default authRoutes;
