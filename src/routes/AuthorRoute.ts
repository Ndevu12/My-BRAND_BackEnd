// Import necessary modules
import { Router} from 'express';
import  AuthorController  from '../controllers/AuthorController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const authorRouter: Router = Router();

// Define routes
authorRouter.post('/create', AuthorController.createAuthor);
authorRouter.put('/update/:id', AuthorController.updateAuthor);
authorRouter.get('/:id', AuthorController.getAuthorById);
authorRouter.get("/", AuthorController.getAllAuthors);
authorRouter.delete('/delete/:id', AuthorController.deleteAuthor);

// Export the router
export default authorRouter
