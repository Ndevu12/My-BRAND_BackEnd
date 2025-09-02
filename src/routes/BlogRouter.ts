// Import necessary modules
import { Router } from "express";
import BlogController from "../controllers/blogController";
import { isAdmin, isAuth, isAdminOrSubscriber } from "../middlewares/authUtils";
import upload from "../helpers/multer";

const blogRoutes: Router = Router();

// Public routes (no authentication required)
blogRoutes.get("/public", BlogController.retrieveAllBlogs); // Public view of all blogs
blogRoutes.get("/public/recent", BlogController.getRecentBlogs); // Public view of recent blogs with pagination
blogRoutes.get("/public/:id", BlogController.getBlogById); // Public view of a single blog
blogRoutes.get("/by-category/:id", BlogController.getBlogsByCategory);
blogRoutes.get("/by-tag", BlogController.getBlogsByTags); // Get blogs by single tag with pagination
blogRoutes.get("/by-title", BlogController.getBlogByTitle);
blogRoutes.get("/by-slug/:slug", BlogController.getBlogBySlug); // SEO-friendly URL route

// Author related routes (specific routes before generic ones)
blogRoutes.get("/author/:id", BlogController.getAuthorByBlogId);

// Protected routes - require authentication
blogRoutes.post("/create", isAdmin, upload.single('image'), BlogController.createBlog);
blogRoutes.put("/update/:id", isAuth, upload.single('image'), BlogController.updateBlog); // Author or admin can update
blogRoutes.delete("/delete/:id", isAuth, BlogController.deleteBlog); // Author or admin can delete
blogRoutes.put("/like/:id", isAdminOrSubscriber, BlogController.likeBlog); // isAuthd users can like

// Generic routes (these should come LAST to avoid conflicts)
blogRoutes.get("/", isAdmin, BlogController.adminGetAllBlogs); // Admin view of all blogs
blogRoutes.get("/:id", isAdminOrSubscriber, BlogController.getBlogById); // Protected view with comments

export default blogRoutes;
