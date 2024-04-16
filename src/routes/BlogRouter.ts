// const necessary modules
import { Router } from 'express';
import BlogController from '../controllers/blogController.ts';
import { isAdmin } from '../middlewares/auth.ts';



const blogRoutes: Router = Router();

blogRoutes.post('/create', BlogController.createBlog);
blogRoutes.put('/update/:id', BlogController.updateBlog);
blogRoutes.delete('/delete/:id', BlogController.deleteBlog);
blogRoutes.get('/:id', BlogController.getBlogById);
blogRoutes.get('/byCategory/:id', BlogController.getBlogsByCategory);
blogRoutes.get("/", BlogController.retrieveAllBlogs);
blogRoutes.get('/like/:id', BlogController.likeBlog);


export default blogRoutes;
