// Import necessary modules
import { Router } from "express";
import CategoryController from "../controllers/BlogCategoryController";
import { isAdmin } from "../middlewares/authUtils";

const blogCategoryRoutes: Router = Router();

// Define routes
blogCategoryRoutes.post("/create", isAdmin, CategoryController.createCategory);
blogCategoryRoutes.get("/:id", CategoryController.getCategoryById);
blogCategoryRoutes.put(
  "/update/:id",
  isAdmin,
  CategoryController.updateCategory
);
blogCategoryRoutes.delete(
  "/delete/:id",
  isAdmin,
  CategoryController.deleteCategory
);
blogCategoryRoutes.get("/", CategoryController.getAllBlogCategories);

export default blogCategoryRoutes;
