// Import necessary modules
import { Router} from 'express';
import  CategoryController  from '../controllers/BlogCategoryController.ts';
import { isAdmin } from '../middlewares/auth.ts';


const blogCategoryRoutes: Router = Router();

// Define routes
blogCategoryRoutes.post('/create', CategoryController.createCategory);
blogCategoryRoutes.get('/:id/',  CategoryController.getCategoryById);
blogCategoryRoutes.put('/update/:id', CategoryController.updateCategory);
blogCategoryRoutes.delete('/delete/:id', CategoryController.deleteCategory);
blogCategoryRoutes.get('/',  CategoryController.getAllBlogCategories);

export default blogCategoryRoutes;
