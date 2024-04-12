// const necessary modules
import express from 'express';
import CommentController from '../controllers/CommentController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.patch('/add', CommentController.createComment);
router.patch('/update/:id', CommentController.updateComment);
router.get('/:id', CommentController.getCommentById);
router.get('/All', CommentController.getAllComments);
router.delete('/delete/:id', CommentController.deleteComment);

// hijokl
// Export the router
export default router;
