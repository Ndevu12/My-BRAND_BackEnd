// Import necessary modules
import { Router } from "express";
import BlogController from "../controllers/blogController";
import { isAdmin, isAuth, isAdminOrSubscriber } from "../middlewares/authUtils";
import upload from "../helpers/multer";

const blogRoutes: Router = Router();

// Public routes (no authentication required)
blogRoutes.get("/public", BlogController.retrieveAllBlogs); // Public view of all blogs
blogRoutes.get("/public/:id", BlogController.getBlogById); // Public view of a single blog
blogRoutes.get("/by-category/:id", BlogController.getBlogsByCategory);
blogRoutes.get("/by-title", BlogController.getBlogByTitle);

// Protected routes - require authentication
blogRoutes.post("/create", isAdmin, upload.single('image'), BlogController.createBlog);
blogRoutes.put("/update/:id", isAuth, upload.single('image'), BlogController.updateBlog); // Author or admin can update
blogRoutes.delete("/delete/:id", isAuth, BlogController.deleteBlog); // Author or admin can delete
blogRoutes.get("/:id", isAdminOrSubscriber, BlogController.getBlogById); // Protected view with comments
blogRoutes.get("/", isAdmin, BlogController.retrieveAllBlogs); // Admin view of all blogs
blogRoutes.put("/like/:id", isAdminOrSubscriber, BlogController.likeBlog); // isAuthd users can like

// Author related routes
blogRoutes.get("/author/:id", BlogController.getAuthorByBlogId);

export default blogRoutes;
