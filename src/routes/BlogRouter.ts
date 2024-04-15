// const necessary modules
import { Router } from 'express';
import BlogController from '../controllers/blogController.ts';
import { isAdmin } from '../middlewares/auth.ts';



const blogRoutes: Router = Router();

blogRoutes.patch('/create', isAdmin, BlogController.createBlog);
blogRoutes.patch('/update/:id', isAdmin, BlogController.updateBlog);
blogRoutes.delete('/delete/:id', isAdmin, BlogController.deleteBlog);
blogRoutes.get('/:id', BlogController.getBlogById);
blogRoutes.get('/byCategory', BlogController.getBlogsByCategory);
blogRoutes.get('/all', BlogController.getAllBlogs);
blogRoutes.get('/like/:id', BlogController.likeBlog);


export default blogRoutes;
