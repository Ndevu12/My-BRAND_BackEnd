// Import necessary modules
import { Router} from 'express';
import { blogCategoryController } from '../controllers/BlogCategoryController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const BlogCategoryController = new blogCategoryController();
const blogCategoryRoutes: Router = Router();

// Define routes
blogCategoryRoutes.patch('/create', isAdmin, BlogCategoryController.createBlogCategory);
blogCategoryRoutes.get('/:id/', BlogCategoryController.getBlogCategoryById);
blogCategoryRoutes.patch('/update/:id', isAdmin, BlogCategoryController.updateBlogCategory);
blogCategoryRoutes.delete('/delete/:id',isAdmin, BlogCategoryController.deleteBlogCategory);
blogCategoryRoutes.get('/All', BlogCategoryController.getAllBlogCategories);

export { blogCategoryRoutes };
