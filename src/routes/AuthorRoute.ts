// Import necessary modules
import { Router} from 'express';
import  AuthorController  from '../controllers/AuthorController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const authorRouter: Router = Router();

// Define routes
authorRouter.patch('/create', isAdmin, AuthorController.createAuthor);
authorRouter.put('/update/:id', isAdmin, AuthorController.updateAuthor);
authorRouter.get('/get/:id', isAdmin,AuthorController.getAuthorById);
authorRouter.get('/all', isAdmin, AuthorController.getAllAuthors);
authorRouter.delete('/delete/:id', isAdmin, AuthorController.deleteAuthor);

// Export the router
export default authorRouter;

