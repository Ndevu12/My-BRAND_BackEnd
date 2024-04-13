// Import necessary modules
import { Router} from 'express';
import { authorController } from '../controllers/AuthorController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const AuthorController = new authorController();

const authorRouter: Router = Router();

// Define routes
authorRouter.patch('/create', isAdmin, AuthorController.createAuthor);
authorRouter.put('/update/:id', isAdmin, AuthorController.updateAuthor);
authorRouter.get('/get/:id', isAdmin,AuthorController.getAuthorById);
authorRouter.get('/all', isAdmin, AuthorController.getAllAuthors);
authorRouter.delete('/delete/:id', isAdmin, AuthorController.deleteAuthor);

// Export the router
export { authorRouter };

