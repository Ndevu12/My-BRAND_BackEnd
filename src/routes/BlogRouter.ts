// const necessary modules
import { Router } from 'express';
import BlogController from '../controllers/blogController.js';

// Create a router instance
const router = Router();

// Define routes
router.post('/Blog/:id/createBlog', BlogController.createBlog);
router.put('/Blog/:id/updateBlog', BlogController.updateBlog);
router.get('/Blog/:id/getBlogById', BlogController.getBlogById);
router.get('/Blog/getAllBlogs', BlogController.getAllBlogs);
router.delete('/Blog/:id/deleteBlog', BlogController.deleteBlog);

// hijokl
// Export the router
export default router;
