// Import necessary modules
import express from 'express';
import BlogCategoryController from '../controllers/BlogCategoryController.ts';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.patch('/Category/create', isAdmin, BlogCategoryController.createBlogCategory);
router.get('/Category/:id/', BlogCategoryController.getBlogCategoryById);
router.patch('/Category/update/:id', isAdmin, BlogCategoryController.updateBlogCategory);
router.delete('/Category/delete/:id',isAdmin, BlogCategoryController.deleteBlogCategory);
router.get('/Category/All', BlogCategoryController.getAllBlogCategories);

// hijokl
// Export the router
export default router;
