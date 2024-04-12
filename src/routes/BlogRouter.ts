// const necessary modules
import { Router } from 'express';
import BlogController from '../controllers/blogController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = Router();

// Define routes
router.patch('/create', isAdmin, BlogController.createBlog);
router.patch('/update/:id', isAdmin, BlogController.updateBlog);
router.delete('/delete/:id', isAdmin, BlogController.deleteBlog);
router.get('/:id', BlogController.getBlogById);
router.get('/category', BlogController.getBlogsByCategory);
router.get('/All', BlogController.getAllBlogs);
router.get('/like/:id', BlogController.likeBlog);


// hijokl
// Export the router
export default router;
