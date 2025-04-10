// const necessary modules
import { Router } from "express";
import BlogController from "../controllers/blogController";
import { isAdmin } from "../middlewares/authentication";
import { isAdminOrSubscriber } from "../middlewares/authorize";
import upload from "../helpers/multer";

const blogRoutes: Router = Router();

// Author related routes
blogRoutes.get("/author/:id", BlogController.getAuthorByBlogId);
blogRoutes.put("/author/update/:id", BlogController.updateBlogAuthor);
blogRoutes.delete("/author/delete/:id", BlogController.deleteAuthor);

// Blog routes with proper middleware and file upload support
blogRoutes.post("/create", isAdmin, upload.single('image'), BlogController.createBlog);
blogRoutes.put("/update/:id", isAdmin, upload.single('image'), BlogController.updateBlog);
blogRoutes.delete("/delete/:id", isAdmin, BlogController.deleteBlog);
blogRoutes.get("/:id", isAdminOrSubscriber, BlogController.getBlogById);
blogRoutes.get("/byCategory/:id", BlogController.getBlogsByCategory);
blogRoutes.get("/byTitle", BlogController.getBlogByTitle);
blogRoutes.get("/", isAdmin, BlogController.retrieveAllBlogs);
blogRoutes.put("/like/:id", isAdminOrSubscriber, BlogController.likeBlog);

export default blogRoutes;
