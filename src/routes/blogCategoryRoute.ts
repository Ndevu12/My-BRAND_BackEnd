// Import necessary modules
import { Router} from 'express';
import  CategoryController  from '../controllers/BlogCategoryController.ts';
import { isAdmin } from '../middlewares/auth.ts';


const blogCategoryRoutes: Router = Router();

// Define routes
blogCategoryRoutes.patch('/create', isAdmin,  CategoryController.createCategory);
blogCategoryRoutes.get('/:id/',  CategoryController.getCategoryById);
blogCategoryRoutes.patch('/update/:id', isAdmin,  CategoryController.updateCategory);
blogCategoryRoutes.delete('/delete/:id',isAdmin,  CategoryController.deleteCategory);
blogCategoryRoutes.get('/All',  CategoryController.getAllBlogCategories);

export default blogCategoryRoutes;
