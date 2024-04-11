// const necessary modules
import express from 'express';
import CommentController from '../controllers/CommentController.js';

// Create a router instance
const router = express.Router();

// Define routes
router.post('/comment/postID/:id/createComment', CommentController.createComment);
router.put('/comment/postID/:id/updateComment', CommentController.updateComment);
router.get('/comment/postID/:id/getCommentById', CommentController.getCommentById);
router.get('/comment/postID/getAllComments', CommentController.getAllComments);
router.delete('/comment/postID/:id/deleteComment', CommentController.deleteComment);

// hijokl
// Export the router
export default router;
