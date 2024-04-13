// Import necessary modules
import express from 'express';
import BlogCategoryController from '../controllers/BlogCategoryController.ts';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.patch('/create', isAdmin, BlogCategoryController.createBlogCategory);
router.get('/:id/', BlogCategoryController.getBlogCategoryById);
router.patch('/update/:id', isAdmin, BlogCategoryController.updateBlogCategory);
router.delete('/delete/:id',isAdmin, BlogCategoryController.deleteBlogCategory);
router.get('/All', BlogCategoryController.getAllBlogCategories);

// hijokl
// Export the router
export default router;
