// Import necessary modules
import { Router} from 'express';
import  AuthorController  from '../controllers/AuthorController.ts';
import { isAdmin } from '../middlewares/authentication.ts';

const authorRouter: Router = Router();

// Define routes
authorRouter.post('/create', isAdmin, AuthorController.createAuthor);
authorRouter.put('/update/:id', isAdmin,AuthorController.updateAuthor);
authorRouter.get('/:id', AuthorController.getAuthorById);
authorRouter.get("/", AuthorController.getAllAuthors);
authorRouter.delete('/delete/:id',isAdmin, AuthorController.deleteAuthor);

// Export the router
export default authorRouter
