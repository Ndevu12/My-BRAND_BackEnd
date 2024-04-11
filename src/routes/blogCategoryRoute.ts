// Import necessary modules
import express from 'express';
import BlogCategoryController from '../controllers/BlogCategoryController.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/blog/Category/:id/createBlogCategory', BlogCategoryController.createBlogCategory);
router.get('/blog/Category/:id/getBlogCategoryById', BlogCategoryController.getBlogCategoryById);
router.put('/blog/Category/:id/updateBlogCategory', BlogCategoryController.updateBlogCategory);
router.get('/blog/Category/getAllBlogCategories', BlogCategoryController.getAllBlogCategories);
router.delete('/blog/Category/:id/deleteBlogCategory', BlogCategoryController.deleteBlogCategory);

// hijokl
// Export the router
export default router;
