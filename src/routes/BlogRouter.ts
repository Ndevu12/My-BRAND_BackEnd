// const necessary modules
import { Router } from 'express';
import BlogController from '../controllers/blogController.ts';
import { isAdmin } from '../middlewares/authentication.ts';
import { isAdminOrSubscriber } from '../middlewares/authorize.ts';



const blogRoutes: Router = Router();

blogRoutes.post('/create',isAdmin, BlogController.createBlog);
blogRoutes.put('/update/:id', isAdmin, BlogController.updateBlog);
blogRoutes.delete('/delete/:id',isAdmin, BlogController.deleteBlog);
blogRoutes.get('/:id', BlogController.getBlogById);
blogRoutes.get('/byCategory/:id', BlogController.getBlogsByCategory);
blogRoutes.get("/", BlogController.retrieveAllBlogs);
blogRoutes.post('/like/:id', isAdminOrSubscriber, BlogController.likeBlog);


export default blogRoutes;
 