// Import necessary modules
import express from 'express';
import AuthorController from '../controllers/AuthorController.ts';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.patch('/create', isAdmin, AuthorController.createAuthor);
router.put('/update/:id', isAdmin, AuthorController.updateAuthor);
router.get('/get/:id', isAdmin,AuthorController.getAuthorById);
router.get('/all', isAdmin, AuthorController.getAllAuthors);
router.delete('/delete/:id', isAdmin, AuthorController.deleteAuthor);

// Export the router
export default router;

