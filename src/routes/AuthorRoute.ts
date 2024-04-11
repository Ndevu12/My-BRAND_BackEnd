// Import necessary modules
import express from 'express';
import AuthorController from '../controllers/AuthorController.ts';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/Author/:id/createAuthor', AuthorController.createAuthor);
router.put('/Author/:id/updateAuthor', AuthorController.updateAuthor);
router.get('/Author/:id/getAuthorById', AuthorController.getAuthorById);
router.get('/Author/getAllAuthors', AuthorController.getAllAuthors);
router.delete('/Author/:id/deleteAuthor', AuthorController.deleteAuthor);

// Export the router
export default router;

