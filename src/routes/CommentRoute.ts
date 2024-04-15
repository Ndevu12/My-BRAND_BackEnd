// const necessary modules
import { Router } from 'express';
import CommentController from '../controllers/CommentController.ts';

const  commentRoutes: Router = Router();

// Define routes
 commentRoutes.patch('/add', CommentController.createComment);
 commentRoutes.patch('/update/:id', CommentController.updateComment);
 commentRoutes.get('/:id', CommentController.getCommentById);
 commentRoutes.get('/all', CommentController.getAllComments);
 commentRoutes.delete('/delete/:id', CommentController.deleteComment);

// hijokl
// Export the router
export default commentRoutes;
