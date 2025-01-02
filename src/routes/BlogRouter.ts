// const necessary modules
import { Router } from "express";
import BlogController from "../controllers/blogController";
import { isAdmin } from "../middlewares/authentication";
import multer from "../helpers/multer";
import UserValidation from "../middlewares/validation/validate";

const blogRoutes: Router = Router();

blogRoutes.post("/create", isAdmin, multer.single('images'), BlogController.createBlog);
// blogRoutes.post("/create", isAdmin, UserValidation.newBlog, multer.single('images'), BlogController.createBlog);
blogRoutes.put("/update/:id", isAdmin, BlogController.updateBlog);
blogRoutes.delete("/delete/:id", isAdmin, BlogController.deleteBlog);
blogRoutes.put("/publish/:id", isAdmin, BlogController.publishBlog);
blogRoutes.put("/unpublish/:id", isAdmin, BlogController.unpublishBlog);
blogRoutes.get("/:id", BlogController.getBlogById as any);
blogRoutes.get("/byCategory/:id", BlogController.getBlogsByCategory);
blogRoutes.get("/byTitle", BlogController.getBlogByTitle);
blogRoutes.get("/status/published", BlogController.getPublishedBlogs);
blogRoutes.get("/", BlogController.retrieveAllBlogs as any);

export default blogRoutes;
